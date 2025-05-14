// server/routes/reviews.js
const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const authMiddleware = require('../middleware/auth');

const TIME_LIMIT = 24 * 60 * 60 * 1000; // 24 saat (milisaniye cinsinden)

// IP adresini almak için yardımcı fonksiyon
const getClientIp = (req) => {
  return req.headers['x-forwarded-for'] || req.socket.remoteAddress;
};

// Tüm yorumları getir (admin)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Yeni yorum ekle (herkes)
router.post('/', async (req, res) => {
  try {
    const clientIp = getClientIp(req);

    // Son 24 saat içinde bu IP'den yorum yapılmış mı kontrol et
    const lastReview = await Review.findOne({ ipAddress: clientIp }).sort({ createdAt: -1 });
    if (lastReview) {
      const timeDifference = Date.now() - new Date(lastReview.createdAt).getTime();
      if (timeDifference < TIME_LIMIT) {
        const remainingTime = Math.ceil((TIME_LIMIT - timeDifference) / (60 * 60 * 1000));
        return res.status(429).json({
          message: `Bu cihazdan 24 saat içinde zaten yorum yapıldı. Lütfen ${remainingTime} saat sonra tekrar deneyin.`,
        });
      }
    }

    const review = new Review({
      ...req.body,
      ipAddress: clientIp, // IP adresini ekle
    });
    await review.save();
    res.status(201).json({ message: 'Yorum başarıyla gönderildi.' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Yorum durumunu güncelle (admin)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!review) return res.status(404).json({ message: 'Yorum bulunamadı.' });
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Yorum sil (admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: 'Yorum bulunamadı.' });
    res.json({ message: 'Yorum silindi.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Onaylanmış yorumları getir (herkes)
router.get('/approved', async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'Onaylandı' }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;