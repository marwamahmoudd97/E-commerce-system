const express = require('express');
const { authenticate, requireAdmin } = require('../middleware/auth');
const router = express.Router();


const formatProduct = (product) => {
  return {
    ...product,
  
    price: parseFloat(product.price),
    original_price: product.original_price ? parseFloat(product.original_price) : null,
   
    rating: parseFloat(product.rating),
    review_count: parseInt(product.review_count),
  
    in_stock: Boolean(product.in_stock),
    is_best_seller: Boolean(product.is_best_seller),
    is_new_arrival: Boolean(product.is_new_arrival),
    is_featured: Boolean(product.is_featured),
   
    images: typeof product.images === 'string' ? JSON.parse(product.images) : (product.images || [])
  };
};


// Get best sellers
router.get('/featured/best-sellers', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    
    const [products] = await req.db.execute(
      'SELECT * FROM products WHERE is_best_seller = 1 LIMIT ?',
      [limit]
    );
    
    res.json({ data: products.map(formatProduct), success: true });
  } catch (error) {
    console.error('Error fetching best sellers:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch best sellers' });
  }
});

// Get new arrivals
router.get('/featured/new-arrivals', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const [products] = await req.db.execute(
      'SELECT * FROM products WHERE is_new_arrival = 1 LIMIT ?',
      [limit]
    );
    res.json({ data: products.map(formatProduct), success: true });
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch new arrivals' });
  }
});

// Get featured products
router.get('/featured/featured', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 4;
    const [products] = await req.db.execute(
      'SELECT * FROM products WHERE is_featured = 1 LIMIT ?',
      [limit]
    );
    res.json({ data: products.map(formatProduct), success: true });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch featured products' });
  }
});

// Get all products with filtering, sorting, pagination
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12, category, brand, minPrice, maxPrice, rating, inStock, sort, search } = req.query;

    let query = 'SELECT * FROM products WHERE 1=1';
    let params = [];
    let conditions = [];

    // Search
    if (search) {
      conditions.push('(name LIKE ? OR description LIKE ? OR brand LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Filters
    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }
    if (brand) {
      conditions.push('brand = ?');
      params.push(brand);
    }
    if (minPrice) {
      conditions.push('price >= ?');
      params.push(parseFloat(minPrice));
    }
    if (maxPrice) {
      conditions.push('price <= ?');
      params.push(parseFloat(maxPrice));
    }
    if (rating) {
      conditions.push('rating >= ?');
      params.push(parseFloat(rating));
    }
    if (inStock === 'true') {
      conditions.push('in_stock = 1'); // 使用 1 代替 true
    }

    if (conditions.length > 0) {
      query += ' AND ' + conditions.join(' AND ');
    }

    // Sorting
    let orderBy = 'created_at DESC';
    if (sort) {
      switch (sort) {
        case 'price-asc':
          orderBy = 'price ASC';
          break;
        case 'price-desc':
          orderBy = 'price DESC';
          break;
        case 'rating':
          orderBy = 'rating DESC';
          break;
        case 'newest':
          orderBy = 'created_at DESC';
          break;
        case 'popular':
          orderBy = 'review_count DESC';
          break;
      }
    }
    query += ` ORDER BY ${orderBy}`;

    // Pagination
    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [products] = await req.db.execute(query, params);

    // Get total count
    const countQuery = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
    if (conditions.length > 0) {
      countQuery += ' AND ' + conditions.join(' AND ');
    }
    const [countResult] = await req.db.execute(countQuery, params.slice(0, -2));
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

 
    res.json({
      data: products.map(formatProduct),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages
      },
      success: true
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [products] = await req.db.execute('SELECT * FROM products WHERE id = ?', [id]);

    if (products.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    
    res.json({ data: formatProduct(products[0]), success: true });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch product' });
  }
});

// Get related products
router.get('/:id/related', async (req, res) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit) || 4;

    const [product] = await req.db.execute('SELECT category FROM products WHERE id = ?', [id]);
    if (product.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const [related] = await req.db.execute(
      'SELECT * FROM products WHERE category = ? AND id != ? LIMIT ?',
      [product[0].category, id, limit]
    );

   
    res.json({ data: related.map(formatProduct), success: true });
  } catch (error) {
    console.error('Error fetching related products:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch related products' });
  }
});

// Create product (admin only)
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, description, price, original_price, category, brand, in_stock, images } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ success: false, message: 'Name, price, and category are required' });
    }

    const imagesJson = Array.isArray(images) ? JSON.stringify(images) : '[]';
    
 
    const inStockValue = in_stock ? 1 : 0;

    const [result] = await req.db.execute(
      'INSERT INTO products (name, description, price, original_price, category, brand, in_stock, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, description || '', price, original_price || price, category, brand || '', inStockValue, imagesJson]
    );


    const [newProduct] = await req.db.execute('SELECT * FROM products WHERE id = ?', [result.insertId]);

    res.status(201).json({ 
      data: formatProduct(newProduct[0]), 
      success: true, 
      message: 'Product created successfully' 
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, message: 'Failed to create product' });
  }
});

// Update product (admin only)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, original_price, category, brand, in_stock, images } = req.body;

    const [product] = await req.db.execute('SELECT * FROM products WHERE id = ?', [id]);
    if (product.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
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
    if (price !== undefined) {
      updates.push('price = ?');
      values.push(price);
    }
    if (original_price !== undefined) {
      updates.push('original_price = ?');
      values.push(original_price);
    }
    if (category !== undefined) {
      updates.push('category = ?');
      values.push(category);
    }
    if (brand !== undefined) {
      updates.push('brand = ?');
      values.push(brand);
    }
    if (in_stock !== undefined) {
      updates.push('in_stock = ?');
      values.push(in_stock ? 1 : 0); 
    }
    if (images !== undefined) {
      const imagesJson = Array.isArray(images) ? JSON.stringify(images) : '[]';
      updates.push('images = ?');
      values.push(imagesJson);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    values.push(id);
    await req.db.execute(`UPDATE products SET ${updates.join(', ')} WHERE id = ?`, values);

    const [updatedProduct] = await req.db.execute('SELECT * FROM products WHERE id = ?', [id]);

    res.json({ 
      data: formatProduct(updatedProduct[0]), 
      success: true, 
      message: 'Product updated successfully' 
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, message: 'Failed to update product' });
  }
});

// Delete product (admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const [product] = await req.db.execute('SELECT * FROM products WHERE id = ?', [id]);
    if (product.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await req.db.execute('DELETE FROM products WHERE id = ?', [id]);

    res.json({ 
      success: true, 
      message: 'Product deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, message: 'Failed to delete product' });
  }
});

module.exports = router;
