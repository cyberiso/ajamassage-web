const mongoose = require('mongoose');

const whatsappSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true,
    match: /^\d{10,15}$/ // Telefon numarası validasyonu
  },
  welcomeMessage: {
    type: String,
    required: true,
    maxlength: 500
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('WhatsApp', whatsappSchema);