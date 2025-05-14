// src/pages/Hizmetlerimiz.jsx
import { useState, useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import ServiceCard from '../components/ServiceCard';
import { useTranslation } from 'react-i18next';
import styles from '../styles/Services.module.css';

function Hizmetlerimiz() {
  const { t, i18n } = useTranslation();
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

  const currentLanguage = i18n.language.split('-')[0]; // Dil sadeleştirme

  return (
    <div className={styles.services}>
      <Typography variant="h4" gutterBottom>
        {t('services')}
      </Typography>
      <Grid container spacing={3}>
        {services.length > 0 ? (
          services.map((service, index) => {
            const serviceName = service?.name?.[currentLanguage] || 'Unnamed Service';
            const serviceDescription = service?.description?.[currentLanguage] || '';
            return (
              <Grid item xs={12} sm={6} md={4} key={service._id || index}>
                <ServiceCard
                  service={{
                    ...service,
                    name: serviceName,
                    description: serviceDescription,
                  }}
                />
              </Grid>
            );
          })
        ) : (
          <Typography>{t('no_services')}</Typography>
        )}
      </Grid>
    </div>
  );
}

export default Hizmetlerimiz;