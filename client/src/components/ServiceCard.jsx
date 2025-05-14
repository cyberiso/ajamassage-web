// src/components/ServiceCard.jsx
import { Card, CardMedia, CardContent, CardActionArea, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from '../styles/Hizmetlerimiz.module.css';

function ServiceCard({ service }) {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language.split('-')[0]; // "en", "tr", "de"
  
  // Çok dilli yapıya uygun hizmet adı
  let serviceName = 'Unnamed Service';
  
  if (typeof service?.name === 'object') {
    // name bir obje ise (çok dilli yapı)
    serviceName = service.name[currentLanguage] || service.name.en || service.name.tr || 'Unnamed Service';
  } else if (typeof service?.name === 'string') {
    // name bir string ise (eski yapı)
    serviceName = service.name;
  }

  // Hata ayıklama için console.log
  console.log('Service:', service);
  console.log('Current Language:', currentLanguage);
  console.log('Service Name:', serviceName);

  return (
    <Card>
      <CardActionArea component={Link} to={`/service/${service?._id || ''}`}>
        <CardMedia
          component="img"
          height="200"
          image={service?.image || 'https://via.placeholder.com/200'}
          alt={serviceName}
          className={styles.cardImage}
        />
        <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="div">
            {serviceName}
          </Typography>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2">
              {t('duration')}: {service?.duration || 'N/A'} {t('minutes')}
            </Typography>
            <Typography variant="body2">
              {t('price')}: {service?.price ? `${service.price}€` : 'N/A'}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default ServiceCard;