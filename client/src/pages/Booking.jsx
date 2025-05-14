import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BookingForm from '../components/BookingForm';
import { ArrowBack } from '@mui/icons-material';

const BookingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          minHeight: { xs: 'calc(100vh - 120px)', sm: 'auto' }
        }}
      >
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <Button 
            startIcon={<ArrowBack />} 
            onClick={handleGoBack}
            sx={{ mr: 2 }}
          >
            {t('back')}
          </Button>
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1, textAlign: 'center' }}>
            {t('book_appointment')}
          </Typography>
        </Box>
        
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          flexGrow: 1
        }}>
          <BookingForm onClose={handleGoBack} />
        </Box>
      </Box>
    </Container>
  );
};

export default BookingPage;
