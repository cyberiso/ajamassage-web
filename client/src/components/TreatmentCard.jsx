// src/components/TreatmentCard.jsx
import { Card, CardMedia, CardContent, CardActionArea, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import styles from '../styles/TreatmentCard.module.css'; // Yeni stil dosyası

function TreatmentCard({ treatment, to }) {
  const treatmentName = treatment?.name || 'Unnamed Treatment';
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // 600px altı mobil

  return (
    <Card className={styles.card}>
      <CardActionArea component={Link} to={to || `/treatment/${treatment?._id || ''}`}>
        <CardMedia
          component="img"
          height={isMobile ? '150' : '200'} // Mobilde 150px, büyük ekranlarda 200px
          image={treatment?.image || 'https://via.placeholder.com/200'}
          alt={treatmentName}
          sx={{ mb: isMobile ? 1 : 2 }} // Mobilde boşluk 8px
          className={styles.cardImage}
        />
        <CardContent
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: isMobile ? 1 : 2, // Mobilde iç boşluk 8px
          }}
        >
          <Typography variant={isMobile ? 'subtitle1' : 'h6'} component="div">
            {treatmentName}
          </Typography>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant={isMobile ? 'caption' : 'body2'}>
              Süre: {treatment?.duration || 'N/A'} dk
            </Typography>
            <Typography variant={isMobile ? 'caption' : 'body2'}>
              Fiyat: {treatment?.price ? `${treatment.price}€` : 'N/A'}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default TreatmentCard;