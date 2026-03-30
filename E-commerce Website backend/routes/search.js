const express = require('express');
const router = express.Router();

// Search products
router.get('/', async (req, res) => {
  try {
    const { q: query } = req.query;

    if (!query) {
      return res.json({ data: [], success: true });
    }

    const searchTerm = `%${query}%`;
    const [products] = await req.db.execute(
      `SELECT * FROM products WHERE
       name LIKE ? OR
       description LIKE ? OR
       brand LIKE ? OR
       JSON_SEARCH(tags, 'one', ?) IS NOT NULL`,
      [searchTerm, searchTerm, searchTerm, query]
    );

    res.json({ data: products, success: true });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ success: false, message: 'Search failed' });
  }
});

module.exports = router;