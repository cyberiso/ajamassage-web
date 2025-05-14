const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bookingRoutes = require('./routes/booking');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/auth');
const sliderRoutes = require('./routes/slider');
const treatmentsRouter = require('./routes/treatments');
const servicesRoutes = require('./routes/services');
const photosRoutes = require('./routes/photos');
const messageRoutes = require('./routes/message'); // Yeni eklenen rota
const reviewRoutes = require('./routes/reviews'); // Yeni eklenen route
const whatsappRoutes = require('./routes/whatsapp');
const settingsRoutes = require('./routes/settings'); // Yeni eklenen route
const usersRoutes = require('./routes/users'); // Kullanıcı yönetimi için eklendi
const path = require('path'); // Statik dosya için

dotenv.config();

const app = express();
// Allow all CORS requests for development
app.use(cors());

// Add CORS headers to all responses
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Yüklenen fotoğraflar için

// Gelen tüm istekleri loglama middleware'i (Route tanımlarından önce)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Received ${req.method} request for ${req.url}`);
  next();
});

// MongoDB Bağlantısı
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Bağlantı başarısızsa sunucuyu kapat
  });

app.use('/api/auth', authRoutes);
// authMiddleware'ı genel olarak değil, sadece gerekli rotalarda kullanacağız
app.use('/api/bookings', bookingRoutes);
app.use('/api/sliders', sliderRoutes); // Slider rotası
app.use('/api/treatments', treatmentsRouter);
app.use('/api/services', servicesRoutes);
app.use('/api/photos', photosRoutes); // Yeni route
app.use('/api/messages', messageRoutes); // Mesaj rotası
app.use('/api/reviews', reviewRoutes); // Yeni eklenen route
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/settings', settingsRoutes); // Yeni eklenen route
app.use('/api/users', usersRoutes); // Kullanıcı yönetimi için eklendi

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
