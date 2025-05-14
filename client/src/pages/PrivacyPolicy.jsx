// src/pages/PrivacyPolicy.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Helmet } from 'react-helmet-async'; // Helmet eklendi

function PrivacyPolicy() {
  const { t, i18n } = useTranslation();
  const [pageContent, setPageContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/settings/page/privacyPolicy');
        const currentLanguage = i18n.language.split('-')[0];
        setPageContent(response.data[currentLanguage] || '');
        setError(null);
      } catch (err) {
        console.error("Error fetching Privacy Policy content:", err);
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
    const sections = t('privacy_policy.sections', { returnObjects: true });
    if (typeof sections !== 'object' || sections === null) return '';

    const mainSectionsKeys = Object.keys(sections).filter(key => !key.includes('.'));
    const subSectionsKeys = Object.keys(sections).filter(key => key.includes('.'));
    let htmlContent = '';

    mainSectionsKeys.forEach(mainKey => {
      // Ana bölüm başlığını h2 yapalım
      htmlContent += `<h2>${sections[mainKey].title}</h2>`; 
      const subs = subSectionsKeys.filter(subKey => subKey.startsWith(`${mainKey}.`));
      subs.forEach(subKey => {
        // Alt bölüm başlığını h3 yapalım
        htmlContent += `<div style="margin-left: 16px;"><h3>${sections[subKey].title}</h3>`; 
        if (sections[subKey].content) {
          htmlContent += `<p>${sections[subKey].content}</p>`;
        }
        htmlContent += `</div>`;
      });
      if (sections[mainKey].content) {
        htmlContent += `<p>${sections[mainKey].content}</p>`;
      }
    });
    return htmlContent;
  };

  // API'den içerik geldiyse onu kullan, yoksa fallback'i çağır
  const displayContent = pageContent 
    ? pageContent // dangerouslySetInnerHTML HTML'i işleyeceği için replace'e gerek yok
    : fallbackContent();

  // Meta açıklama
  const metaDescription = pageContent 
    ? pageContent.substring(0, 160).replace(/<[^>]*>?/gm, '') + '...' 
    : t('privacy_policy.sections.1.1.content', '').substring(0, 160) + '...'; // Fallback için ilk alt bölümün içeriği

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
        <title>{`${t('privacy_policy_link')} - Aja Massage`}</title>
        <meta name="description" content={metaDescription} />
        {/* Kanonik URL'ler dil koduna göre ayarlanmalı */}
        <link rel="canonical" href={`https://ajamassage.de/${currentLanguage === 'de' ? 'datenschutz' : 'privacy-policy'}`} /> 
        <meta property="og:title" content={`${t('privacy_policy_link')} - Aja Massage`} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={`https://ajamassage.de/${currentLanguage === 'de' ? 'datenschutz' : 'privacy-policy'}`} />
        <meta name="twitter:title" content={`${t('privacy_policy_link')} - Aja Massage`} />
        <meta name="twitter:description" content={metaDescription} />
      </Helmet>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom> {/* component="h1" zaten vardı */}
            {t('privacy_policy.title')}
          </Typography>
      </Box>
      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      {/* İçeriği HTML olarak göster */}
      <Box dangerouslySetInnerHTML={{ __html: displayContent }} />
    </Container>
  </> // Fragment kapatıldı
  );
}

export default PrivacyPolicy;
