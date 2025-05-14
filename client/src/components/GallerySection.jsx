// src/components/GallerySection.jsx
import { useState, useEffect } from 'react';
import { Box, Grid, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import styles from '../styles/Galeri.module.css';

function GallerySection() {
  const { t } = useTranslation();
  const [photos, setPhotos] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // 600px altı mobil

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/photos');
        if (!response.ok) throw new Error(t('fetch_photos_failed'));
        const data = await response.json();
        setPhotos(data);
      } catch (error) {
        console.error('Fotoğraf çekme hatası:', error);
      }
    };

    fetchPhotos();
  }, [t]);

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
        {t('gallery')}
      </Typography>
      <Grid container spacing={isMobile ? 1 : 2}> {/* Mobilde spacing 1 */}
        {photos.slice(0, 4).map((photo) => (
          <Grid item xs={12} sm={6} md={3} key={photo._id}>
            <img
              src={`http://localhost:5000${photo.url}`}
              alt={t('gallery_image_alt')}
              className={styles.galleryImage}
              style={{
                width: '100%',
                height: isMobile ? '150px' : '200px', // Mobilde 150px
                objectFit: 'cover',
                cursor: 'pointer',
              }}
            />
          </Grid>
        ))}
      </Grid>
      <Box sx={{ textAlign: 'center', mt: isMobile ? 2 : 3 }}> {/* Mobilde mt 2 */}
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/gallery"
          size={isMobile ? 'small' : 'medium'} // Mobilde küçük buton
        >
          {t('view_all_photos')}
        </Button>
      </Box>
    </Box>
  );
}

export default GallerySection;