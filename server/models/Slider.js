const mongoose = require('mongoose');

const sliderSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true }, // Slider fotoğrafının URL'si
  title: { type: String, required: true },    // Slider başlığı
  description: { type: String },              // Opsiyonel açıklama
}, { timestamps: true });

module.exports = mongoose.model('Slider', sliderSchema);