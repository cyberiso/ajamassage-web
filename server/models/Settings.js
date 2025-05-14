const mongoose = require('mongoose');

const localizedStringSchema = new mongoose.Schema({
  tr: { type: String, default: '' },
  en: { type: String, default: '' },
  de: { type: String, default: '' },
}, { _id: false });

const settingsSchema = new mongoose.Schema({
  // Genel Site Ayarları
  siteName: { type: String, default: 'Aja Massage' },
  logoUrl: { type: String, default: '' },
  faviconUrl: { type: String, default: '' },
  contactEmail: { type: String, default: '' },
  contactPhone: { type: String, default: '' },
  address: { type: String, default: '' },
  
  // Sosyal Medya Ayarları
  socialMedia: {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
    youtube: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    whatsapp: { type: String, default: '' },
    telegram: { type: String, default: '' }
  },

  // Sayfa İçerikleri (Çok Dilli)
  aboutUs: { type: localizedStringSchema, default: () => ({}) },
  termsAndConditions: { type: localizedStringSchema, default: () => ({}) },
  privacyPolicy: { type: localizedStringSchema, default: () => ({}) },

  // Mevcut Ayarlar
  isBookingEnabled: {
    type: Boolean,
    default: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true }); // timestamps createdAt ve updatedAt alanlarını otomatik yönetir

// Ayarların sadece bir tane olmasını sağlamak için (singleton pattern)
// Bu, ilk ayar dokümanı oluşturulduktan sonra yeni dokümanların eklenmesini engeller.
// Genellikle bu tür ayarlar tek bir dokümanda tutulur.
settingsSchema.statics.getSingleton = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

settingsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Settings', settingsSchema);
