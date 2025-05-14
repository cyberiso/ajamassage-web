const express = require('express');
const router = express.Router();
const WhatsApp = require('../models/whatsapp');
const authMiddleware = require('../middleware/auth');

// Tüm kullanıcılar için erişime açık hale getir
router.get('/', async (req, res) => { // authMiddleware kaldırıldı
    try {
      const reps = await WhatsApp.find().sort({ createdAt: -1 });
      res.json(reps);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });



// Yeni temsilci ekle
router.post('/', authMiddleware, async (req, res) => {
  try {
    const newRep = new WhatsApp(req.body);
    await newRep.save();
    res.status(201).json(newRep);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Temsilci güncelle
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updatedRep = await WhatsApp.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedRep);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Temsilci sil
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await WhatsApp.findByIdAndDelete(req.params.id);
    res.json({ message: 'Temsilci silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;