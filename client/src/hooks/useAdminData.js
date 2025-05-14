// src/hooks/useAdminData.js
import { useState, useEffect } from 'react';

const useAdminData = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [isAdmin, setIsAdmin] = useState(false); // Admin rolünü kontrol etmek için
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || ''); // Kullanıcı rolünü saklamak için
  const [bookings, setBookings] = useState([]);
  const [sliders, setSliders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [services, setServices] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [error, setError] = useState(null); // Hata durumunu takip etmek için
  const [whatsappReps, setWhatsappReps] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    // Token yoksa veya geçersizse
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    // Token'ın süresini kontrol et ve kullanıcı rolünü doğrula (JWT varsayımıyla)
    const checkTokenExpiry = () => {
      try {
        const tokenParts = token.split('.');
        
        if (tokenParts.length !== 3) {
          setIsAuthenticated(false);
          setIsAdmin(false);
          setUserRole('');
          return false;
        }
        
        const decodedToken = JSON.parse(atob(tokenParts[1])); // JWT payload'u decode et
        const expiry = decodedToken.exp * 1000; // Unix timestamp'i milisaniyeye çevir
        
        // Token süresi dolmuş mu kontrol et
        if (Date.now() >= expiry) {
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          setIsAuthenticated(false);
          setIsAdmin(false);
          setUserRole('');
          setError('Oturum süresi doldu. Lütfen tekrar giriş yapın.');
          return false;
        }
        
        // Kullanıcı rolünü kontrol et
        const role = decodedToken.role || localStorage.getItem('userRole') || '';
        setUserRole(role);
        localStorage.setItem('userRole', role);
        
        // Admin rolünü kontrol et
        const isAdminUser = role === 'admin';
        setIsAdmin(isAdminUser);
        
        // GEÇİCİ ÇÖZÜM: Her kullanıcıyı admin olarak işaretle
        setIsAdmin(true);
        
        return true;
      } catch (err) {
        console.error('Token decode hatası:', err);
        setError('Geçersiz token. Lütfen tekrar giriş yapın.');
        setIsAuthenticated(false);
        setIsAdmin(false);
        setUserRole('');
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        return false;
      }
    };

    // Token geçerli değilse devam etme
    if (!checkTokenExpiry()) return;

    const fetchData = async () => {
      try {
        const endpoints = [
          'bookings',
          'sliders',
          'messages',
          'reviews',
          'services',
          'photos',
          'treatments',
          'whatsapp',
        ];

        const responses = await Promise.all(
          endpoints.map(endpoint =>
            fetch(`http://localhost:5000/api/${endpoint}`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`, // Doğru header formatı
              },
            }).then(res => {
              if (!res.ok) {
                throw new Error(`${endpoint} isteği başarısız: ${res.status} - ${res.statusText}`);
              }
              return res.json();
            })
          )
        );

        const [bookingsData, slidersData, messagesData, reviewsData, servicesData, photosData, treatmentsData, whatsappData] = responses;

        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
        setSliders(Array.isArray(slidersData) ? slidersData : []);
        setMessages(Array.isArray(messagesData) ? messagesData : []);
        setReviews(Array.isArray(reviewsData) ? reviewsData : []);
        setServices(Array.isArray(servicesData) ? servicesData : []);
        setPhotos(Array.isArray(photosData) ? photosData : []);
        setTreatments(Array.isArray(treatmentsData) ? treatmentsData : []);
        setWhatsappReps(Array.isArray(whatsappData) ? whatsappData : []);
        setError(null); // Hata yoksa sıfırla
      } catch (err) {
        console.error('Veri çekme hatası:', err.message);
        setError(err.message); // Hata mesajını kaydet
        setIsAuthenticated(false); // Yetkilendirme hatası varsa false yap
      }
    };

    fetchData();
  }, [token]);

  return {
    isAuthenticated,
    isAdmin,       // Admin rolünü döndür
    userRole,      // Kullanıcı rolünü döndür
    bookings,
    setBookings,
    sliders,
    setSliders,
    messages,
    setMessages,
    reviews,
    setReviews,
    services,
    setServices,
    photos,
    setPhotos,
    treatments,
    setTreatments,
    whatsappReps,
    setWhatsappReps,
    error, // Hata durumunu döndür
  };
};

export default useAdminData;
