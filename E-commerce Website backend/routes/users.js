const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticate, requireAdmin } = require('../middleware/auth');
const router = express.Router();

// Get all users (admin only)
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const [users] = await req.db.execute('SELECT id, email, name, avatar, role, created_at FROM users ORDER BY created_at DESC');
    res.json({ data: users, success: true });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [users] = await req.db.execute('SELECT id, email, name, avatar, role, created_at FROM users WHERE id = ?', [id]);

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ data: users[0], success: true });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const [users] = await req.db.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const user = users[0];

    const isValidPassword = !user.password || await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      { expiresIn: '7d' }
    );

    res.json({
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        token
      },
      success: true,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, avatar, role } = req.body;
      // VALIDATION: Check if required fields are present
    if (!email || !password || !name) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email, password, and name are required' 
      });
    }

    
    const userRole = role || 'user';

    // Check if user exists
    const [existing] = await req.db.execute(
      'SELECT id FROM users WHERE email = ?', 
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists' 
      });
    }
     // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 
    await req.db.execute(
      `INSERT INTO users (id, email, password, name, avatar, role) 
       VALUES (UUID(), ?, ?, ?, ?, ?)`,
      [email, hashedPassword, name, avatar || null, userRole]
    );

  
    const [newUser] = await req.db.execute(
      `SELECT id, email, name, avatar, role, created_at 
       FROM users WHERE email = ?`, 
      [email]
    );

    res.status(201).json({
      data: newUser[0],
      success: true,
      message: 'Registration successful'
    });

  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Registration failed' 
    });
  }
});


// Update user profile
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, avatar, email } = req.body;

    // users  update  profile 
    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'You can only update your own profile' });
    }

    const [user] = await req.db.execute('SELECT * FROM users WHERE id = ?', [id]);
    if (user.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (avatar !== undefined) {
      updates.push('avatar = ?');
      values.push(avatar);
    }
    if (email !== undefined) {
      updates.push('email = ?');
      values.push(email);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    values.push(id);
    await req.db.execute(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);

    const [updatedUser] = await req.db.execute('SELECT id, email, name, avatar, role, created_at FROM users WHERE id = ?', [id]);

    res.json({ 
      data: updatedUser[0], 
      success: true, 
      message: 'Profile updated successfully' 
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
});

// Change password
router.post('/:id/change-password', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new password are required' });
    }

    const [user] = await req.db.execute('SELECT * FROM users WHERE id = ?', [id]);
    if (user.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user[0].password);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await req.db.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);

    res.json({ 
      success: true, 
      message: 'Password changed successfully' 
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ success: false, message: 'Failed to change password' });
  }
});

// Delete user (admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const [user] = await req.db.execute('SELECT * FROM users WHERE id = ?', [id]);
    if (user.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await req.db.execute('DELETE FROM users WHERE id = ?', [id]);

    res.json({ 
      success: true, 
      message: 'User deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
});

module.exports = router;
