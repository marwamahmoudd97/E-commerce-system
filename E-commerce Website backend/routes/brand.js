const express = require('express');
const router = express.Router();

// Get all brands
router.get('/', async (req, res) => {
  try {
    // Fetch all brands from the database
    const [brands] = await req.db.execute('SELECT * FROM brands ORDER BY name');
    
    // Return the list of brands
    res.json({ data: brands, success: true });
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch brands' });
  }
});

// Get a single brand by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [brands] = await req.db.execute('SELECT * FROM brands WHERE id = ?', [id]);

    if (brands.length === 0) {
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }

    res.json({ data: brands[0], success: true });
  } catch (error) {
    console.error('Error fetching brand:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch brand' });
  }
});

module.exports = router;
