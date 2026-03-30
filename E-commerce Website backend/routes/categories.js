const express = require('express');
const { authenticate, requireAdmin } = require('../middleware/auth');
const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const [categories] = await req.db.execute('SELECT * FROM categories ORDER BY name');
    res.json({ data: categories, success: true });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
});

// Get category by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [categories] = await req.db.execute('SELECT * FROM categories WHERE id = ?', [id]);

    if (categories.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({ data: categories[0], success: true });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch category' });
  }
});

// Get category by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const [categories] = await req.db.execute('SELECT * FROM categories WHERE slug = ?', [slug]);

    if (categories.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({ data: categories[0], success: true });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch category' });
  }
});

// Create category (admin only)
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, description, image_url, slug } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const categorySlug = slug || name.toLowerCase().replace(/\s+/g, '-');

    const [result] = await req.db.execute(
      'INSERT INTO categories (name, description, image_url, slug) VALUES (?, ?, ?, ?)',
      [name, description || '', image_url || '', categorySlug]
    );

    const [newCategory] = await req.db.execute('SELECT * FROM categories WHERE id = ?', [result.insertId]);

    res.status(201).json({ 
      data: newCategory[0], 
      success: true, 
      message: 'Category created successfully' 
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ success: false, message: 'Failed to create category' });
  }
});

// Update category (admin only)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image_url, slug } = req.body;

    const [category] = await req.db.execute('SELECT * FROM categories WHERE id = ?', [id]);
    if (category.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (image_url !== undefined) {
      updates.push('image_url = ?');
      values.push(image_url);
    }
    if (slug !== undefined) {
      updates.push('slug = ?');
      values.push(slug);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    values.push(id);
    await req.db.execute(`UPDATE categories SET ${updates.join(', ')} WHERE id = ?`, values);

    const [updatedCategory] = await req.db.execute('SELECT * FROM categories WHERE id = ?', [id]);

    res.json({ 
      data: updatedCategory[0], 
      success: true, 
      message: 'Category updated successfully' 
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ success: false, message: 'Failed to update category' });
  }
});

// Delete category (admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const [category] = await req.db.execute('SELECT * FROM categories WHERE id = ?', [id]);
    if (category.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    await req.db.execute('DELETE FROM categories WHERE id = ?', [id]);

    res.json({ 
      success: true, 
      message: 'Category deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ success: false, message: 'Failed to delete category' });
  }
});

module.exports = router;