const express = require('express');
const router = express.Router();
const Treatment = require('../models/Treatment');
const authMiddleware = require('../middleware/auth');

// Tüm tedavileri getir
router.get('/', async (req, res) => {
  try {
    const treatments = await Treatment.find();
    res.json(treatments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Tedavi ara
router.get('/search', async (req, res) => {
  try {
    const { q: query } = req.query;
    if (!query) return res.json([]);

    const treatments = await Treatment.find({
      $or: [
        { 'name.tr': { $regex: query, $options: 'i' } },
        { 'name.de': { $regex: query, $options: 'i' } },
        { 'name.en': { $regex: query, $options: 'i' } },
        { 'description.tr': { $regex: query, $options: 'i' } },
        { 'description.de': { $regex: query, $options: 'i' } },
        { 'description.en': { $regex: query, $options: 'i' } },
      ],
    });
    res.json(treatments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Yeni tedavi ekle
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description, image, duration, price } = req.body;
    console.log('Gelen veri:', req.body);

    const missingFields = [];
    if (!name?.tr) missingFields.push('Türkçe ad');
    if (!name?.de) missingFields.push('Almanca ad');
    if (!name?.en) missingFields.push('İngilizce ad');
    if (!duration) missingFields.push('süre');
    if (!price) missingFields.push('fiyat');

    if (missingFields.length > 0) {
      return res.status(400).json({ message: `Eksik alanlar: ${missingFields.join(', ')}` });
    }

    const treatment = new Treatment({
      name: { tr: name.tr, de: name.de, en: name.en },
      description: {
        tr: description?.tr || '',
        de: description?.de || '',
        en: description?.en || '',
      },
      image,
      duration,
      price,
    });

    const savedTreatment = await treatment.save();
    console.log('Kaydedilen tedavi:', savedTreatment);
    res.status(201).json(savedTreatment);
  } catch (error) {
    console.error('Hata:', error);
    res.status(400).json({ message: error.message });
  }
});

// Tedavi güncelle
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, description, image, duration, price } = req.body;
    console.log('Gelen veri:', req.body);

    const missingFields = [];
    if (!name?.tr) missingFields.push('Türkçe ad');
    if (!name?.de) missingFields.push('Almanca ad');
    if (!name?.en) missingFields.push('İngilizce ad');
    if (!duration) missingFields.push('süre');
    if (!price) missingFields.push('fiyat');

    if (missingFields.length > 0) {
      return res.status(400).json({ message: `Eksik alanlar: ${missingFields.join(', ')}` });
    }

    const treatment = await Treatment.findByIdAndUpdate(
      req.params.id,
      {
        name: { tr: name.tr, de: name.de, en: name.en },
        description: {
          tr: description?.tr || '',
          de: description?.de || '',
          en: description?.en || '',
        },
        image,
        duration,
        price,
      },
      { new: true }
    );

    if (!treatment) return res.status(404).json({ message: 'Tedavi bulunamadı.' });
    console.log('Güncellenen tedavi:', treatment);
    res.json(treatment);
  } catch (error) {
    console.error('Hata:', error);
    res.status(400).json({ message: error.message });
  }
});

// Tedavi sil
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const treatment = await Treatment.findByIdAndDelete(req.params.id);
    if (!treatment) return res.status(404).json({ message: 'Tedavi bulunamadı.' });
    res.json({ message: 'Tedavi silindi.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;