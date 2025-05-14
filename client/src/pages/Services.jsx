// src/pages/Hizmetlerimiz.jsx
import { useState, useEffect } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import ServiceCard from '../components/ServiceCard';
import StatsSection from '../components/StatsSection';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import styles from '../styles/Services.module.css';

function Services() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // 600px altı mobil
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/services');
        if (!response.ok) throw new Error(t('fetch_services_error'));
        const data = await response.json();
        setServices(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (error) {
        console.error('Hizmetler çekme hatası:', error);
        setError(error.message);
        setLoading(false);
      }
    };
    fetchServices();
  }, [t]);

  if (loading) return <Typography>{t('loading')}</Typography>;
  if (error) return <Typography>{t('error', { message: error })}</Typography>;

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 }, // Mobilde 16px, büyük ekranlarda 32px padding
        maxWidth: '1200px',
        mx: 'auto',
      }}
      className={styles.services}
    >
      <Typography
        variant={isMobile ? 'h5' : 'h4'} // Mobilde h5, büyük ekranlarda h4
        align="center"
        gutterBottom
        className={styles.title}
      >
        {t('services')}
      </Typography>
      <Grid container spacing={isMobile ? 2 : 3}> {/* Mobilde spacing 2, büyük ekranlarda 3 */}
        {services.length > 0 ? (
          services.map((service) => (
            <Grid item xs={12} sm={6} md={4} key={service._id}>
              <ServiceCard service={service} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography align="center" className={styles.noServices}>
              {t('no_services')}
            </Typography>
          </Grid>
        )}
      </Grid>
      <StatsSection />
    </Box>
  );
}

export default Services;