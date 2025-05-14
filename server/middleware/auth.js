const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = function (req, res, next) {
  console.log('Auth middleware running');
  
  // Token'ı 'Authorization' header'ından al (Bearer <token>)
  const authHeader = req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Auth error: No Authorization header or not Bearer format');
    return res.status(401).json({ message: 'Yetki yok, token eksik veya formatı yanlış' });
  }

  const token = authHeader.split(' ')[1]; // "Bearer " kısmını atla

  if (!token) {
    console.log('Auth error: No token found after Bearer');
    return res.status(401).json({ message: 'Yetki yok, token bulunamadı' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log('Auth successful, user ID:', decoded.id, 'Role:', decoded.role);
    
    // Kullanıcının son giriş tarihini güncelle
    // Bu işlemi arka planda yap, yanıtı beklemeden devam et
    User.findByIdAndUpdate(decoded.id, { lastLogin: new Date() })
      .catch(err => console.error('Son giriş tarihi güncellenirken hata:', err));
    
    next();
  } catch (error) {
    console.log('Auth error: Invalid token -', error.message);
    res.status(400).json({ message: 'Geçersiz token' });
  }
};
