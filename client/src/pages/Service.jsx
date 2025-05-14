import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, CardMedia } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

function Service() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // 600px altı mobil
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/services/${id}`);
        if (!response.ok) throw new Error(t('fetch_service_error'));
        const data = await response.json();
        setService(data);
        setLoading(false);
      } catch (error) {
        console.error('Hizmet çekme hatası:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchService();
  }, [id, t]);

  if (loading) return <Typography>{t('loading')}</Typography>;
  if (error) return <Typography>{t('error', { message: error })}</Typography>;
  if (!service) return <Typography>{t('service_not_found')}</Typography>;

  // Dil kodunu sadeleştir (örn: "en-US" -> "en")
  const currentLanguage = i18n.language.split('-')[0]; // "en", "tr", "de"

  // Güvenli erişim ve varsayılan değerler
  const serviceName = service.name?.[currentLanguage] || service.name?.en || service.name?.tr || 'Unnamed Service';
  const serviceDescription = service.description?.[currentLanguage] || service.description?.en || service.description?.tr || 'No description available';

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 }, // Mobilde 16px, büyük ekranlarda 32px padding
        maxWidth: '1200px',
        mx: 'auto',
      }}
    >
      <Typography
        variant={isMobile ? 'h5' : 'h4'} // Mobilde h5, büyük ekranlarda h4
        gutterBottom
      >
        {serviceName}
      </Typography>
      <CardMedia
        component="img"
        height={isMobile ? '200' : '400'} // Mobilde 200px, büyük ekranlarda 400px
        image={service.image || 'https://via.placeholder.com/400'}
        alt={serviceName}
        sx={{
          mb: 2,
          width: '100%',
          objectFit: 'cover',
          borderRadius: '8px',
        }}
      />
      <Box sx={{ mb: isMobile ? 1 : 2 }}>
        <Typography variant={isMobile ? 'body2' : 'body1'}>
          {t('duration')}: {service.duration || 'N/A'} {t('minutes')}
        </Typography>
        <Typography variant={isMobile ? 'body2' : 'body1'}>
          {t('price')}: {service.price ? `${service.price}€` : 'N/A'}
        </Typography>
      </Box>
      <Typography variant={isMobile ? 'body2' : 'body1'}>
        {serviceDescription}
      </Typography>
    </Box>
  );
}

export default Service;