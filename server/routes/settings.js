const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const auth = require('../middleware/auth');

// Get all settings (general and page contents)
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.getSingleton();
    res.json(settings);
  } catch (err) {
    console.error('Settings GET Error:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Update all settings (general and page contents) - admin only
router.put('/', auth, async (req, res) => {
  console.log('--- PUT /api/settings handler entered ---'); // Log eklendi
  try {
    const settings = await Settings.getSingleton();
    const updates = req.body;

    // Genel ayarları güncelle
    if (updates.siteName !== undefined) settings.siteName = updates.siteName;
    if (updates.logoUrl !== undefined) settings.logoUrl = updates.logoUrl;
    if (updates.faviconUrl !== undefined) settings.faviconUrl = updates.faviconUrl;
    if (updates.contactEmail !== undefined) settings.contactEmail = updates.contactEmail;
    if (updates.contactPhone !== undefined) settings.contactPhone = updates.contactPhone;
    if (updates.address !== undefined) settings.address = updates.address;
    if (typeof updates.isBookingEnabled === 'boolean') {
      settings.isBookingEnabled = updates.isBookingEnabled;
    }
    
    // Sosyal medya ayarlarını güncelle
    if (updates.socialMedia && typeof updates.socialMedia === 'object') {
      // Eğer settings.socialMedia henüz tanımlanmamışsa, boş bir nesne oluştur
      if (!settings.socialMedia) settings.socialMedia = {};
      
      // Her bir sosyal medya alanını kontrol et ve güncelle
      const socialMediaPlatforms = ['facebook', 'instagram', 'twitter', 'youtube', 'linkedin', 'whatsapp', 'telegram'];
      socialMediaPlatforms.forEach(platform => {
        if (updates.socialMedia[platform] !== undefined) {
          settings.socialMedia[platform] = updates.socialMedia[platform];
        }
      });
    }

    // Sayfa içeriklerini güncelle (çok dilli)
    const pageTypes = ['aboutUs', 'termsAndConditions', 'privacyPolicy'];
    pageTypes.forEach(pageType => {
      if (updates[pageType] && typeof updates[pageType] === 'object') {
        Object.keys(updates[pageType]).forEach(lang => {
          if (['tr', 'en', 'de'].includes(lang) && settings[pageType]) {
            if (updates[pageType][lang] !== undefined) {
              settings[pageType][lang] = updates[pageType][lang];
            }
          }
        });
      }
    });
    
    settings.updatedAt = Date.now(); // updatedAt manuel olarak güncelleniyor, pre('save') hook'u da var.
                                     // timestamps: true zaten updatedAt'i yönetir, bu satır gereksiz olabilir
                                     // ancak mevcut yapıyı korumak adına bırakıldı. Modeldeki pre('save') kaldırılabilir.

    await settings.save();
    console.log('Settings Updated:', settings);
    res.json(settings);
  } catch (err) {
    console.error('Settings Update Error:', err);
    res.status(500).json({ 
      message: 'Server Error', 
      error: err.message 
    });
  }
});

// Belirli bir sayfanın içeriğini almak için (kullanıcı arayüzü için)
// Örnek: /api/settings/page/aboutUs
router.get('/page/:pageType', async (req, res) => {
  try {
    const { pageType } = req.params;
    const settings = await Settings.getSingleton();
    
    if (!settings[pageType]) {
      return res.status(404).json({ message: 'Page content not found' });
    }
    // Sadece ilgili sayfanın içeriğini döndür (örn: { tr: "...", en: "...", de: "..." })
    res.json(settings[pageType]);
  } catch (err) {
    console.error(`Error fetching page content for ${req.params.pageType}:`, err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});


module.exports = router;
