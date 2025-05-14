const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Photo = require('../models/Photo');
const authMiddleware = require('../middleware/auth');

// Multer ayarları
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Fotoğraflar uploads klasörüne kaydedilecek
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Benzersiz dosya adı
  },
});
const upload = multer({ storage });

// Tüm fotoğrafları getir (herkes)
router.get('/', async (req, res) => {
  try {
    const photos = await Photo.find().sort({ createdAt: -1 }); // En son eklenen ilk
    res.json(photos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fotoğraf yükle (admin)
router.post('/', authMiddleware, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Fotoğraf dosyası gereklidir.' });
    }
    const photo = new Photo({
      url: `/uploads/${req.file.filename}`,
    });
    await photo.save();
    console.log('Eklenen fotoğraf:', photo); // Log ekle
    res.status(201).json(photo);
  } catch (error) {
    console.error('Fotoğraf yükleme hatası:', error);
    res.status(400).json({ message: error.message });
  }
});

// Fotoğraf güncelle (admin)
router.put('/:id', authMiddleware, upload.single('photo'), async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ message: 'Fotoğraf bulunamadı.' });

    if (req.file) {
      photo.url = `/uploads/${req.file.filename}`;
    }
    await photo.save();
    res.json(photo);
  } catch (error) {
    console.error('Fotoğraf güncelleme hatası:', error);
    res.status(400).json({ message: error.message });
  }
});

// Fotoğraf sil (admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const photo = await Photo.findByIdAndDelete(req.params.id);
    if (!photo) return res.status(404).json({ message: 'Fotoğraf bulunamadı.' });
    res.json({ message: 'Fotoğraf silindi.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;