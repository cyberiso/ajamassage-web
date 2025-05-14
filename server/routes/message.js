const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const authMiddleware = require('../middleware/auth');

// Tüm mesajları getir (admin)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Yeni mesaj ekle (herkes)
router.post('/', async (req, res) => {
  try {
    const message = new Message(req.body);
    await message.save();
    res.status(201).json({ message: 'Mesaj başarıyla gönderildi.' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Mesaj sil (admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ message: 'Mesaj bulunamadı.' });
    res.json({ message: 'Mesaj silindi.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mesajı okundu olarak işaretle (admin)
router.put('/:id/read', authMiddleware, async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!message) return res.status(404).json({ message: 'Mesaj bulunamadı.' });
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Toplu mesaj sil (admin)
router.post('/bulk-delete', authMiddleware, async (req, res) => {
  const { ids } = req.body;
  try {
    await Message.deleteMany({ _id: { $in: ids } });
    res.json({ message: 'Mesajlar silindi.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Toplu mesajı okundu yap (admin)
router.post('/bulk-read', authMiddleware, async (req, res) => {
  const { ids } = req.body;
  try {
    const updatedMessages = await Message.updateMany(
      { _id: { $in: ids } },
      { isRead: true },
      { new: true }
    );
    res.json({ message: 'Mesajlar okundu olarak işaretlendi.', updatedMessages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;