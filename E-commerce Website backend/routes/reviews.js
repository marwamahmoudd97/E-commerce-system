const express = require('express');
const { authenticate, requireAdmin } = require('../middleware/auth');
const router = express.Router();

// Get reviews by product ID
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;
    const [reviews] = await req.db.execute(
      'SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [productId, parseInt(limit), offset]
    );

    const [countResult] = await req.db.execute(
      'SELECT COUNT(*) as total FROM reviews WHERE product_id = ?',
      [productId]
    );
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    res.json({
      data: reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages
      },
      success: true
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
  }
});

// Create a new review
router.post('/', authenticate, async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;
    const userId = req.user.id;

    if (!productId || !rating || !title) {
      return res.status(400).json({ success: false, message: 'Product ID, rating, and title are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    const [user] = await req.db.execute('SELECT id, name, avatar FROM users WHERE id = ?', [userId]);
    if (user.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const [product] = await req.db.execute('SELECT id FROM products WHERE id = ?', [productId]);
    if (product.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const [result] = await req.db.execute(
      'INSERT INTO reviews (id, product_id, user_id, user_name, user_avatar, rating, title, comment, date, verified) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, NOW(), 0)',
      [productId, userId, user[0].name, user[0].avatar || '', rating, title, comment || '']
    );

    await updateProductRating(req.db, productId);

    res.status(201).json({
      data: {
        id: result.insertId,
        productId,
        userId,
        userName: user[0].name,
        userAvatar: user[0].avatar,
        rating,
        title,
        comment,
        date: new Date().toISOString().split('T')[0],
        helpful: 0,
        verified: false
      },
      success: true,
      message: 'Review submitted successfully'
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ success: false, message: 'Failed to submit review' });
  }
});

async function updateProductRating(db, productId) {
  const [reviews] = await db.execute(
    'SELECT AVG(rating) as avgRating, COUNT(*) as count FROM reviews WHERE product_id = ?',
    [productId]
  );

  const avgRating = reviews[0].avgRating || 0;
  const count = reviews[0].count;

  await db.execute(
    'UPDATE products SET rating = ?, review_count = ? WHERE id = ?',
    [avgRating, count, productId]
  );
}

// Update review
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, title, comment } = req.body;

    const [review] = await req.db.execute('SELECT * FROM reviews WHERE id = ?', [id]);
    if (review.length === 0) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Users can only update their own reviews, admins can update any
    if (req.user.id !== review[0].user_id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'You can only edit your own reviews' });
    }

    const updates = [];
    const values = [];

    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
      }
      updates.push('rating = ?');
      values.push(rating);
    }
    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }
    if (comment !== undefined) {
      updates.push('comment = ?');
      values.push(comment);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    values.push(id);
    await req.db.execute(`UPDATE reviews SET ${updates.join(', ')} WHERE id = ?`, values);

    const [updatedReview] = await req.db.execute('SELECT * FROM reviews WHERE id = ?', [id]);
    await updateProductRating(req.db, review[0].product_id);

    res.json({ 
      data: updatedReview[0], 
      success: true, 
      message: 'Review updated successfully' 
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ success: false, message: 'Failed to update review' });
  }
});

// Delete review
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const [review] = await req.db.execute('SELECT * FROM reviews WHERE id = ?', [id]);
    if (review.length === 0) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Users can only delete their own reviews, admins can delete any
    if (req.user.id !== review[0].user_id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'You can only delete your own reviews' });
    }

    const productId = review[0].product_id;
    await req.db.execute('DELETE FROM reviews WHERE id = ?', [id]);
    await updateProductRating(req.db, productId);

    res.json({ 
      success: true, 
      message: 'Review deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ success: false, message: 'Failed to delete review' });
  }
});

module.exports = router;