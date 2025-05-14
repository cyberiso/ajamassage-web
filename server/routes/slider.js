const express = require('express');
const router = express.Router();
const Slider = require('../models/Slider');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Dosya yükleme ayarları
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
  
  const upload = multer({ storage });
  
  // Tüm slider'ları getir
  router.get('/', async (req, res) => {
    try {
      const sliders = await Slider.find();
      res.json(sliders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
// Yeni slider ekle (admin)
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    console.log('POST Gelen veri:', req.body, 'Dosya:', req.file);
    const slider = new Slider({
      imageUrl: `/uploads/${req.file.filename}`,
      title: req.body.title,
      description: req.body.description,
    });
    await slider.save();
    res.status(201).json(slider);
  } catch (error) {
    console.error('Slider POST error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Slider güncelle (admin)
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    console.log('PUT Gelen veri:', req.body, 'Dosya:', req.file, 'ID:', req.params.id);
    const updateData = req.file
      ? { ...req.body, imageUrl: `/uploads/${req.file.filename}` }
      : req.body;
    const slider = await Slider.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!slider) return res.status(404).json({ message: 'Slider bulunamadı.' });
    res.json(slider);
  } catch (error) {
    console.error('Slider PUT error:', error);
    res.status(400).json({ message: error.message });
  }
});

// Slider sil (admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const slider = await Slider.findByIdAndDelete(req.params.id);
    if (!slider) return res.status(404).json({ message: 'Slider bulunamadı.' });
    res.json({ message: 'Slider silindi.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;