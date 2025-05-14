import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Çeviri dosyalarını import et
import translationTR from './locales/tr/translation.json'; // Türkçe çeviriler
import translationDE from './locales/de/translation.json'; // Almanca çeviriler
import translationEN from './locales/en/translation.json'; // İngilizce çeviriler

// Çeviri kaynaklarını tanımla
const resources = {
  tr: {
    translation: translationTR,
  },
  de: {
    translation: translationDE,
  },
  en: {
    translation: translationEN,
  },
};

const isAdminRoute = window.location.pathname.startsWith('/admin');

const i18nInstance = i18n.createInstance();

if (!isAdminRoute) {
  i18nInstance.use(LanguageDetector); // Dil tespitini sadece admin dışı yollarda kullan
}

i18nInstance
  .use(initReactI18next)
  .init({
    resources,
    lng: isAdminRoute ? 'tr' : 'de', // Admin için 'tr', diğerleri için 'de' varsayılan
    fallbackLng: isAdminRoute ? 'tr' : 'de', // Admin için 'tr', diğerleri için 'de' yedek
    detection: isAdminRoute ? { order: [] } : { // Admin için dil tespitini devre dışı bırak
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
      checkWhitelist: true,
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18nInstance;
