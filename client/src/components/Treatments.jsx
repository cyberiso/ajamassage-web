// src/components/Treatments.jsx
import { useState, useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import TreatmentCard from './TreatmentCard';
import StatsSection from '../components/StatsSection';
import { useTranslation } from 'react-i18next';
import styles from '../styles/Services.module.css';

function Treatments() {
  const { t, i18n } = useTranslation();
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/treatments');
        if (!response.ok) throw new Error(t('fetch_treatments_error'));
        const data = await response.json();
        console.log('Treatments verisi:', data);
        setTreatments(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (error) {
        console.error('Fizyoterapi hizmetleri çekme hatası:', error);
        setError(error.message);
        setLoading(false);
      }
    };
    fetchTreatments();
  }, [t]);

  if (loading) return <Typography>{t('loading')}</Typography>;
  if (error) return <Typography>{t('error', { message: error })}</Typography>;

  const currentLanguage = i18n.language.split('-')[0];
  console.log('Current Language:', currentLanguage);

  return (
    <div className={styles.services}>
      <Typography variant="h4" gutterBottom align="center">
        {t('physiotherapy_services')}
      </Typography>
      <Grid container spacing={3}>
        {treatments.length > 0 ? (
          treatments.map((treatment, index) => {
            console.log('Treatment objesi:', treatment);
            console.log('treatment.name:', treatment.name);
            console.log('treatment.name[currentLanguage]:', treatment.name?.[currentLanguage]);

            const treatmentName = treatment?.name?.[currentLanguage] || 'Unnamed Treatment';
            const treatmentDescription = treatment?.description?.[currentLanguage] || '';
            
            console.log('Gönderilen treatmentName:', treatmentName);

            return (
              <Grid item xs={12} sm={6} md={4} key={treatment._id || index}>
                <TreatmentCard
                  treatment={{
                    ...treatment,
                    name: treatmentName,
                    description: treatmentDescription,
                  }}
                />
              </Grid>
            );
          })
        ) : (
          <Typography>{t('no_treatments')}</Typography>
        )}
      </Grid>
      <StatsSection />
    </div>
  );
}

export default Treatments;