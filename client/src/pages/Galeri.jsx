// src/pages/Galeri.jsx
import { useState, useEffect } from 'react';
import { Box, Grid, Typography, Modal, IconButton } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import StatsSection from '../components/StatsSection';
import styles from '../styles/Galeri.module.css';

function Galeri() {
  const { t } = useTranslation();
  const [photos, setPhotos] = useState([]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/photos');
        if (!response.ok) throw new Error(t('fetch_photos_failed'));
        const data = await response.json();
        console.log('Galeri - photos:', data);
        setPhotos(data);
      } catch (error) {
        console.error('Fotoğraf çekme hatası:', error);
      }
    };

    fetchPhotos();
  }, [t]);

  const handleOpen = (index) => setSelectedPhotoIndex(index);
  const handleClose = () => setSelectedPhotoIndex(null);
  const handleNext = () => setSelectedPhotoIndex((prev) => (prev + 1) % photos.length);
  const handlePrev = () => setSelectedPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);

  return (
    <Box sx={{ p: 4, maxWidth: '1200px', mx: 'auto' }}>
      <Typography variant="h4" gutterBottom align="center">
        {t('gallery')}
      </Typography>
      <Grid container spacing={2}>
        {photos.map((photo, index) => (
          <Grid item xs={12} sm={6} md={3} key={photo._id}>
            <img
              src={`http://localhost:5000${photo.url}`}
              alt={t('gallery_image_alt')}
              className={styles.galleryImage}
              style={{ width: '100%', height: '200px', objectFit: 'cover', cursor: 'pointer' }}
              onClick={() => handleOpen(index)}
            />
          </Grid>
        ))}
      </Grid>

      <StatsSection />

      {/* Lightbox Modal */}
      {selectedPhotoIndex !== null && (
        <Modal open={true} onClose={handleClose}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'black',
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconButton
              onClick={handlePrev}
              sx={{
                position: 'absolute',
                left: 20,
                color: 'white',
                bgcolor: 'rgba(0, 0, 0, 0.6)',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' },
                p: 1.5,
                borderRadius: '50%',
              }}
            >
              <ArrowBackIos sx={{ fontSize: 30 }} />
            </IconButton>
            <img
              src={`http://localhost:5000${photos[selectedPhotoIndex].url}`}
              alt={t('enlarged_photo_alt')}
              style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain' }}
            />
            <IconButton
              onClick={handleNext}
              sx={{
                position: 'absolute',
                right: 20,
                color: 'white',
                bgcolor: 'rgba(0, 0, 0, 0.6)',
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' },
                p: 1.5,
                borderRadius: '50%',
              }}
            >
              <ArrowForwardIos sx={{ fontSize: 30 }} />
            </IconButton>
          </Box>
        </Modal>
      )}
    </Box>
  );
}

export default Galeri;