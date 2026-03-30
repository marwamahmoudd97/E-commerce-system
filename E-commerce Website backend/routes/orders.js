const express = require('express');
const { authenticate, requireAdmin } = require('../middleware/auth');
const router = express.Router();

// Get orders by user ID
router.get('/user/:userId', authenticate, async (req, res) => {
  try {
    const { userId } = req.params;

    // Users can only see their own orders, admins can see all
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const [orders] = await req.db.execute(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    for (let order of orders) {
      const [items] = await req.db.execute(
        `SELECT oi.*, p.name, p.images, p.price as current_price
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    res.json({ data: orders, success: true });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
});

// Get order by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const [orders] = await req.db.execute('SELECT * FROM orders WHERE id = ?', [id]);

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const order = orders[0];

    // Users can only see their own orders, admins can see all
    if (req.user.id !== order.user_id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const [items] = await req.db.execute(
      `SELECT oi.*, p.name, p.images, p.price as current_price
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [id]
    );
    order.items = items;

    res.json({ data: order, success: true });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
});

// Create a new order
router.post('/', authenticate, async (req, res) => {
  try {
    const { items, subtotal, shipping, tax, total, shippingAddress, paymentMethod } = req.body;
    const userId = req.user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order items are required' });
    }

    if (!subtotal || !total) {
      return res.status(400).json({ success: false, message: 'Order totals are required' });
    }

    const orderId = `order-${Date.now()}`;

    await req.db.execute(
      `INSERT INTO orders (id, user_id, subtotal, shipping, tax, total, shipping_address, payment_method, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [orderId, userId, subtotal, shipping || 0, tax || 0, total, JSON.stringify(shippingAddress), paymentMethod || 'unknown', 'pending']
    );

    for (const item of items) {
      const productId = item.product?.id || item.product_id;
      const price = item.product?.price || item.price;
      
      await req.db.execute(
        'INSERT INTO order_items (id, order_id, product_id, quantity, price) VALUES (UUID(), ?, ?, ?, ?)',
        [orderId, productId, item.quantity, price]
      );
    }

    res.status(201).json({
      data: {
        id: orderId,
        userId,
        items,
        subtotal,
        shipping,
        tax,
        total,
        status: 'pending',
        shippingAddress,
        paymentMethod,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      success: true,
      message: 'Order placed successfully'
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Failed to place order' });
  }
});

// Get all orders (admin)
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const [orders] = await req.db.execute(
      'SELECT * FROM orders ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [parseInt(limit), offset]
    );

    const [countResult] = await req.db.execute('SELECT COUNT(*) as total FROM orders');
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    res.json({
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages
      },
      success: true
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
});

// Update order status (admin only)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const [order] = await req.db.execute('SELECT * FROM orders WHERE id = ?', [id]);
    if (order.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    await req.db.execute('UPDATE orders SET status = ? WHERE id = ?', [status, id]);

    const [updatedOrder] = await req.db.execute('SELECT * FROM orders WHERE id = ?', [id]);

    res.json({ 
      data: updatedOrder[0], 
      success: true, 
      message: 'Order status updated successfully' 
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ success: false, message: 'Failed to update order' });
  }
});

// Cancel order
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const [order] = await req.db.execute('SELECT * FROM orders WHERE id = ?', [id]);
    if (order.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Users can only cancel their own orders, admins can cancel any
    if (req.user.id !== order[0].user_id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    // Only pending orders can be cancelled
    if (order[0].status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Only pending orders can be cancelled' });
    }

    await req.db.execute('UPDATE orders SET status = ? WHERE id = ?', ['cancelled', id]);

    res.json({ 
      success: true, 
      message: 'Order cancelled successfully' 
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel order' });
  }
});

module.exports = router;