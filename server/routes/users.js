const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get all users
router.get('/', auth, async (req, res) => {
  console.log('GET /api/users request received');
  try {
    const users = await User.find().select('-password');
    console.log(`Found ${users.length} users`);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get a single user
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new user
router.post('/', auth, async (req, res) => {
  const { name, email, password, role } = req.body;
  
  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Bu email adresi zaten kullanılıyor' });
    
    // Create new user
    user = new User({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role: role || 'user'
    });
    
    await user.save();
    
    // Return user without password
    const newUser = await User.findById(user._id).select('-password');
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a user
router.put('/:id', auth, async (req, res) => {
  const { name, email, role, active, currentPassword, newPassword } = req.body;
  const updateFields = {};
  
  if (name) updateFields.name = name;
  if (email) updateFields.email = email;
  if (role) updateFields.role = role;
  if (active !== undefined) updateFields.active = active;
  
  // Kullanıcı bilgilerini al
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
  
  // Eğer parola değişikliği yapılıyorsa
  if (currentPassword && newPassword) {
    // Mevcut parolayı kontrol et
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mevcut parola yanlış' });
    }
    
    // Yeni parolayı hashle
    updateFields.password = await bcrypt.hash(newPassword, 10);
  } else if (req.body.password) {
    // Doğrudan parola değişikliği (admin için)
    updateFields.password = await bcrypt.hash(req.body.password, 10);
  }
  
  try {
    // Check if user exists
    let user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    
    // Update user
    user = await User.findByIdAndUpdate(
      req.params.id, 
      { $set: updateFields },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a user
router.delete('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Kullanıcı silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
