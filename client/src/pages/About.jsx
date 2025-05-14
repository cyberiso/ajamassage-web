// src/pages/About.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Helmet } from 'react-helmet-async'; // Helmet eklendi
import StatsSection from '../components/StatsSection';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import styles from '../styles/Hakkimizda.module.css';

function About() {
  const { t, i18n } = useTranslation();
  const [pageContent, setPageContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // 600px altı mobil

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/settings/page/aboutUs');
        const currentLanguage = i18n.language.split('-')[0];
        setPageContent(response.data[currentLanguage] || '');
        setError(null);
      } catch (err) {
        console.error("Error fetching About Us content:", err);
        setError(t('fetch_service_error'));
        setPageContent('');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [i18n.language, t]);

  // API'den içerik geldiyse onu kullan, yoksa fallback kullan
  const displayContent = pageContent
    ? pageContent // dangerouslySetInnerHTML HTML'i işleyeceği için replace'e gerek yok
    : `${t('about_us_text_1')}<br /><br />${t('about_us_text_2')}`; // Fallback içerik

  // Meta etiketleri için içerikten kısa bir açıklama oluştur
  const metaDescription = pageContent 
    ? pageContent.substring(0, 160).replace(/<[^>]*>?/gm, '') + '...' 
    : t('about_us_text_1').substring(0, 160) + '...';

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
        <title>{`${t('about_us')} - Aja Massage`}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={`https://ajamassage.de/${currentLanguage === 'tr' ? 'hakkimizda' : 'about'}`} />
        <meta property="og:title" content={`${t('about_us')} - Aja Massage`} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={`https://ajamassage.de/${currentLanguage === 'tr' ? 'hakkimizda' : 'about'}`} />
        {/* <meta property="og:image" content="URL_ZUM_BILD" /> */}
        <meta name="twitter:title" content={`${t('about_us')} - Aja Massage`} />
        <meta name="twitter:description" content={metaDescription} />
        {/* <meta name="twitter:image" content="URL_ZUM_BILD" /> */}
      </Helmet>
      <Box
        sx={{
          p: { xs: 2, sm: 4 },
          maxWidth: '1200px',
          mx: 'auto',
        }}
        className={styles.container}
      >
        <Typography
          variant={isMobile ? 'h5' : 'h4'}
          component="h1" // component="h1" eklendi
          className={styles.title}
          textAlign="center"
        >
          {t('about_us')}
        </Typography>
      <Grid container spacing={isMobile ? 2 : 4} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography
            variant={isMobile ? 'subtitle1' : 'h6'}
            component="h2" // component="h2" eklendi
            className={styles.sectionTitle}
          >
            {t('who_we_are')}
          </Typography>
          {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
          {/* İçeriği tek bir Box içinde göster */}
          <Box className={styles.text} dangerouslySetInnerHTML={{ __html: displayContent }} /> {/* Typography yerine Box */}
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/contact"
            className={styles.button}
            size={isMobile ? 'small' : 'medium'} // Mobilde küçük buton
          >
            {t('contact_us')}
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <img
            src="https://3dduvarkagitlari.com/Content/images/2021/6/6/l/3dduvarkagitlari-d7b69f1e.jpg"
            alt={t('about_us_image_alt')}
            className={styles.image}
          />
        </Grid>
      </Grid>
      <Box sx={{ mt: isMobile ? 2 : 4 }}>
        <Typography
          variant={isMobile ? 'subtitle1' : 'h6'}
          component="h2" // component="h2" eklendi
          className={styles.sectionTitle}
        >
          {t('why_choose_us')}
        </Typography>
        <Typography variant="body1" className={styles.text}>
          - {t('reason_1')}
          <br />
          - {t('reason_2')}
          <br />
          - {t('reason_3')}
          <br />
          - {t('reason_4')}
        </Typography>
      </Box>
      <StatsSection />
    </Box>
  </> // Fragment kapatıldı
  );
}

export default About;
