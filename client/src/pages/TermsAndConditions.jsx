// src/pages/TermsAndConditions.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Helmet } from 'react-helmet-async'; // Helmet eklendi

function TermsAndConditions() {
  const { t, i18n } = useTranslation();
  const [pageContent, setPageContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/settings/page/termsAndConditions');
        const currentLanguage = i18n.language.split('-')[0];
        setPageContent(response.data[currentLanguage] || '');
        setError(null);
      } catch (err) {
        console.error("Error fetching Terms and Conditions content:", err);
        setError(t('fetch_service_error')); // Genel bir hata mesajı
        setPageContent(''); // Hata durumunda içeriği boşalt
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [i18n.language, t]);

  // Yedek içerik (API'den veri gelmezse veya boşsa)
  const fallbackContent = () => {
    const sections = t('terms_and_conditions.sections', { returnObjects: true });
    if (typeof sections !== 'object' || sections === null) return '';
    return Object.keys(sections)
      .map(section => `<h2>${section}. ${t(`terms_and_conditions.sections.${section}.title`)}</h2><p>${t(`terms_and_conditions.sections.${section}.content`)}</p>`) // h5 yerine h2
      .join('');
  };

  // API'den içerik geldiyse onu kullan, yoksa fallback'i çağır
  const displayContent = pageContent 
    ? pageContent // dangerouslySetInnerHTML HTML'i işleyeceği için replace'e gerek yok
    : fallbackContent();

  // Meta açıklama
  const metaDescription = pageContent 
    ? pageContent.substring(0, 160).replace(/<[^>]*>?/gm, '') + '...' 
    : t('terms_and_conditions.sections.1.content', '').substring(0, 160) + '...'; // Fallback için ilk bölümün içeriği

  const currentLanguage = i18n.language.split('-')[0];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <> {/* Fragment eklendi */}
      <Helmet>
        <html lang={currentLanguage} />
        <title>{`${t('terms_and_conditions_link')} - Aja Massage`}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href="https://ajamassage.de/termsandconditions" /> {/* Dil ayrımı yoksa tek URL */}
        <meta property="og:title" content={`${t('terms_and_conditions_link')} - Aja Massage`} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content="https://ajamassage.de/termsandconditions" />
        <meta name="twitter:title" content={`${t('terms_and_conditions_link')} - Aja Massage`} />
        <meta name="twitter:description" content={metaDescription} />
      </Helmet>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom> {/* component="h1" zaten vardı */}
            {t('terms_and_conditions.title')}
          </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          {t('terms_and_conditions.effective_date')}
        </Typography>
      </Box>
      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      {/* İçeriği HTML olarak göster */}
      <Box dangerouslySetInnerHTML={{ __html: displayContent }} />
    </Container>
  </> // Fragment kapatıldı
  );
}

export default TermsAndConditions;
