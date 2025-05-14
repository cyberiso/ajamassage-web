const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const authMiddleware = require('../middleware/auth');
const crypto = require('crypto'); // Rastgele kod için

router.post('/', async (req, res) => {
  try {
    const cancelToken = crypto.randomBytes(4).toString('hex').toUpperCase(); // Ör: XYZ123
    const booking = new Booking({ ...req.body, cancelToken });
    await booking.save();
    res.status(201).json({ ...booking.toObject(), cancelToken });
  } catch (error) {
    console.error('Booking POST error:', error);
    res.status(400).json({ message: error.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/available', async (req, res) => {
  try {
    const bookings = await Booking.find({ status: { $ne: 'İptal Edildi' } });
    res.json(bookings.map((b) => b.date));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Yeni iptal rotası
router.post('/cancel', async (req, res) => {
  const { cancelToken } = req.body;
  try {
    const booking = await Booking.findOne({ cancelToken });
    if (!booking) {
      return res.status(404).json({ message: 'Geçersiz iptal kodu.' });
    }

    // --- Zaman Kontrolü Başlangıcı ---
    const now = new Date();
    const appointmentTime = new Date(booking.date); // booking.date'in Date objesi veya parse edilebilir formatta olduğunu varsayıyoruz
    const timeDifferenceHours = (appointmentTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (timeDifferenceHours < 24) {
      // Sabit mesaj yerine çeviri anahtarını döndür
      return res.status(400).json({ message: 'error_cancel_too_late' });
    }
    // --- Zaman Kontrolü Sonu ---

    if (booking.status === 'İptal Edildi') {
      return res.status(400).json({ message: 'Bu randevu zaten iptal edilmiş.' });
    }
    booking.status = 'İptal Edildi';
    await booking.save();
    res.json({ message: 'Randevunuz başarıyla iptal edildi.' });
  } catch (error) {
    console.error('Booking cancel error:', error);
    res.status(500).json({ message: 'Bir hata oluştu.' });
  }
});

module.exports = router;
