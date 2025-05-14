// server/routes/services.js
const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const authMiddleware = require('../middleware/auth');

// Tüm hizmetleri getir (herkes)
router.get('/', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Tek bir hizmeti getir (herkes)
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Hizmet bulunamadı.' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Hizmet ara
router.get('/search', async (req, res) => {
  try {
    const { q: query } = req.query;
    if (!query) return res.json([]);

    const services = await Service.find({
      $or: [
        { 'name.tr': { $regex: query, $options: 'i' } },
        { 'name.de': { $regex: query, $options: 'i' } },
        { 'name.en': { $regex: query, $options: 'i' } },
        { 'description.tr': { $regex: query, $options: 'i' } },
        { 'description.de': { $regex: query, $options: 'i' } },
        { 'description.en': { $regex: query, $options: 'i' } },
      ],
    });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Yeni hizmet ekle (admin)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description, image, duration, price } = req.body;
    console.log('Gelen veri:', req.body); // Frontend'den gelen veriyi logla

    // Zorunlu alanların kontrolü
    const missingFields = [];
    if (!name?.tr) missingFields.push('Türkçe ad');
    if (!name?.de) missingFields.push('Almanca ad');
    if (!name?.en) missingFields.push('İngilizce ad');
    if (!duration) missingFields.push('süre');
    if (!price) missingFields.push('fiyat');

    if (missingFields.length > 0) {
      return res.status(400).json({ message: `Eksik alanlar: ${missingFields.join(', ')}` });
    }

    const service = new Service({
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

    const savedService = await service.save();
    console.log('Kaydedilen hizmet:', savedService); // Veritabanına kaydedilen veriyi logla
    res.status(201).json(savedService);
  } catch (error) {
    console.error('Hata:', error); // Hata detaylarını logla
    res.status(400).json({ message: error.message });
  }
});

// Hizmet güncelle (admin)
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

    const service = await Service.findByIdAndUpdate(
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

    if (!service) return res.status(404).json({ message: 'Hizmet bulunamadı.' });
    console.log('Güncellenen hizmet:', service);
    res.json(service);
  } catch (error) {
    console.error('Hata:', error);
    res.status(400).json({ message: error.message });
  }
});

// Hizmet sil (admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: 'Hizmet bulunamadı.' });
    res.json({ message: 'Hizmet silindi.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;