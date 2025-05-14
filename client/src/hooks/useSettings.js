// src/hooks/useSettings.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { getApiUrl } from '../utils/apiConfig';

const useSettings = () => {
  const [settings, setSettings] = useState({
    siteName: '',
    logoUrl: '',
    faviconUrl: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    isBookingEnabled: true,
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
      youtube: '',
      linkedin: '',
      whatsapp: '',
      telegram: ''
    },
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Dinamik API URL'ini kullanarak çağrı yap
        const { data } = await axios.get(getApiUrl('settings'));
        console.log('API Response:', data);
        
        // Sosyal medya verilerini kontrol et
        const socialMedia = data.socialMedia || {};
        console.log('Social Media from API:', socialMedia);
        
        setSettings({
          ...data,
          // API'den gelen sosyal medya verilerini kullan veya varsayılan boş nesneyi kullan
          socialMedia: {
            facebook: socialMedia.facebook || '',
            instagram: socialMedia.instagram || '',
            twitter: socialMedia.twitter || '',
            youtube: socialMedia.youtube || '',
            linkedin: socialMedia.linkedin || '',
            whatsapp: socialMedia.whatsapp || '',
            telegram: socialMedia.telegram || ''
          },
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error fetching settings:', error);
        setSettings(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load settings'
        }));
      }
    };

    fetchSettings();
  }, []);

  return settings;
};

export default useSettings;
