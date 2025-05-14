const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true }, // Telefon numarası eklendi
  date: { type: Date, required: true },
  service: { type: String, required: true },
  status: { type: String, default: 'Beklemede' },
  note: { type: String, default: '' },
  cancelToken: { type: String, unique: true }, // İptal kodu
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);