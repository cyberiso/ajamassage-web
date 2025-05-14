// server/models/Service.js
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    tr: { type: String, required: true },
    de: { type: String, required: true },
    en: { type: String, required: true },
  },
  description: {
    tr: { type: String },
    de: { type: String },
    en: { type: String },
  },
  image: { type: String },
  duration: { type: Number, required: true },
  price: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Service', serviceSchema);