const express = require('express');
const router = express.Router();

// Get user's wishlist
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const [wishlist] = await req.db.execute(
      'SELECT product_id FROM wishlist WHERE user_id = ?',
      [userId]
    );

    const productIds = wishlist.map(item => item.product_id);
    res.json({ data: productIds, success: true });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch wishlist' });
  }
});

// Add to wishlist
router.post('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId } = req.body;

    await req.db.execute(
      'INSERT IGNORE INTO wishlist (id, user_id, product_id) VALUES (UUID(), ?, ?)',
      [userId, productId]
    );

    const [wishlist] = await req.db.execute(
      'SELECT product_id FROM wishlist WHERE user_id = ?',
      [userId]
    );

    const productIds = wishlist.map(item => item.product_id);
    res.json({ data: productIds, success: true, message: 'Added to wishlist' });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ success: false, message: 'Failed to add to wishlist' });
  }
});

// Remove from wishlist
router.delete('/:userId/:productId', async (req, res) => {
  try {
    const { userId, productId } = req.params;

    await req.db.execute(
      'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    const [wishlist] = await req.db.execute(
      'SELECT product_id FROM wishlist WHERE user_id = ?',
      [userId]
    );

    const productIds = wishlist.map(item => item.product_id);
    res.json({ data: productIds, success: true, message: 'Removed from wishlist' });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ success: false, message: 'Failed to remove from wishlist' });
  }
});

module.exports = router;