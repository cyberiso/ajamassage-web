// src/pages/Gallery.jsx
import { useState, useEffect } from 'react';
import { Box, Grid, Typography, Modal, IconButton } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import StatsSection from '../components/StatsSection';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import styles from '../styles/Galeri.module.css';

function Gallery() {
  const { t } = useTranslation();
  const [photos, setPhotos] = useState([]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
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
        console.error('Photo fetch error:', error);
      }
    };
    fetchPhotos();
  }, [t]);

  const handleOpen = (index) => setSelectedPhotoIndex(index);
  const handleClose = () => setSelectedPhotoIndex(null);
  const handleNext = () => setSelectedPhotoIndex((prev) => (prev + 1) % photos.length);
  const handlePrev = () => setSelectedPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);

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
        {photos.map((photo, index) => (
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
              onClick={() => handleOpen(index)}
            />
          </Grid>
        ))}
      </Grid>
      <StatsSection />
      {selectedPhotoIndex !== null && (
        <Modal open={true} onClose={handleClose}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'black',
              p: isMobile ? 1 : 2, // Mobilde 8px padding
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: isMobile ? '95vw' : 'auto', // Mobilde tam genişlik
              maxWidth: '90vw',
              maxHeight: '90vh',
            }}
          >
            <IconButton
              onClick={handlePrev}
              sx={{
                position: 'absolute',
                left: isMobile ? 10 : 20, // Mobilde daha yakın
                color: 'white',
                bgcolor: 'rgba(0, 0, 0, 0.6)',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' },
                p: isMobile ? 1 : 1.5, // Mobilde 8px padding
                borderRadius: '50%',
              }}
            >
              <ArrowBackIos sx={{ fontSize: isMobile ? 24 : 30 }} /> {/* Mobilde ikon küçülür */}
            </IconButton>
            <img
              src={`http://localhost:5000${photos[selectedPhotoIndex].url}`}
              alt={t('enlarged_photo_alt')}
              style={{
                maxWidth: isMobile ? '85vw' : '90vw', // Mobilde biraz daha küçük
                maxHeight: isMobile ? '85vh' : '90vh', // Mobilde biraz daha küçük
                objectFit: 'contain',
              }}
            />
            <IconButton
              onClick={handleNext}
              sx={{
                position: 'absolute',
                right: isMobile ? 10 : 20, // Mobilde daha yakın
                color: 'white',
                bgcolor: 'rgba(0, 0, 0, 0.6)',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' },
                p: isMobile ? 1 : 1.5, // Mobilde 8px padding
                borderRadius: '50%',
              }}
            >
              <ArrowForwardIos sx={{ fontSize: isMobile ? 24 : 30 }} /> {/* Mobilde ikon küçülür */}
            </IconButton>
          </Box>
        </Modal>
      )}
    </Box>
  );
}

export default Gallery;