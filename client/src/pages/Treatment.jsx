// src/pages/Treatment.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CardMedia } from '@mui/material';
import { useTranslation } from 'react-i18next';
import StatsSection from '../components/StatsSection';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

function Treatment() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // 600px altı mobil
  const [treatment, setTreatment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTreatment = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/treatments/${id}`);
        if (!response.ok) throw new Error(t('fetch_treatment_error'));
        const data = await response.json();
        setTreatment(data);
        setLoading(false);
      } catch (error) {
        console.error('Fizyoterapi hizmeti çekme hatası:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchTreatment();
  }, [id, t]);

  if (loading) return <Typography>{t('loading')}</Typography>;
  if (error) return <Typography>{t('error', { message: error })}</Typography>;
  if (!treatment) return <Typography>{t('treatment_not_found')}</Typography>;

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 }, // Mobilde 16px, büyük ekranlarda 32px
        maxWidth: '1200px',
        mx: 'auto',
      }}
    >
      <Typography
        variant={isMobile ? 'h5' : 'h4'} // Mobilde h5, büyük ekranlarda h4
        gutterBottom
        align="center"
      >
        {treatment.name[i18n.language]}
      </Typography>
      <CardMedia
        component="img"
        height={isMobile ? '200' : '400'} // Mobilde 200px, büyük ekranlarda 400px
        image={treatment.image || 'https://via.placeholder.com/400'}
        alt={treatment.name[i18n.language]}
        sx={{
          mb: 2,
          width: '100%', // Ekran genişliğine uyumlu
          objectFit: 'cover', // Taşmayı önler
          borderRadius: '8px', // Yuvarlak köşeler
        }}
      />
      <Box sx={{ mb: isMobile ? 1 : 2 }}> {/* Mobilde boşluk 8px */}
        <Typography variant={isMobile ? 'body2' : 'body1'}> {/* Mobilde body2 */}
          {t('duration')}: {treatment.duration} {t('minutes')}
        </Typography>
        <Typography variant={isMobile ? 'body2' : 'body1'}> {/* Mobilde body2 */}
          {t('price')}: {treatment.price}€
        </Typography>
      </Box>
      <Typography variant={isMobile ? 'body2' : 'body1'}> {/* Mobilde body2 */}
        {treatment.description ? treatment.description[i18n.language] : ''}
      </Typography>
      <StatsSection />
    </Box>
  );
}

export default Treatment;