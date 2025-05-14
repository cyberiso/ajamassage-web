// src/components/CancelBooking.jsx
import { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import styles from '../components/BookingForm.module.css'; // Aynı stil dosyasını kullanıyoruz

function CancelBooking({ onClose }) { // onClose prop’unu ekledim, pop-up için tutarlı olsun
  const { t } = useTranslation();
  const [cancelToken, setCancelToken] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cancelToken) {
      setMessage(t('please_enter_cancel_code'));
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/bookings/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cancelToken }),
      });
      const data = await response.json();
      if (response.ok) {
          setMessage(t('booking_cancelled'));
          setCancelToken('');
          if (onClose) {
            setTimeout(() => onClose(), 2000); // Başarı mesajından 2 saniye sonra kapanır
          }
        } else {
          // Sunucudan gelen mesajı (anahtar olabilir) çevir
          setMessage(t(data.message || 'cancel_failed'));
        }
      } catch (error) {
        console.error('Cancel error:', error);
      setMessage(t('server_unreachable'));
    }
  };

  return (
    <Box className={styles.container} sx={{ maxWidth: 400, mx: 'auto', mt: 5 }}>
      <Typography variant="h4" gutterBottom>{t('cancel_appointment')}</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label={t('cancel_code')}
          value={cancelToken}
          onChange={(e) => setCancelToken(e.target.value)}
          fullWidth
          margin="normal"
          placeholder={t('cancel_code_placeholder')}
        />
        <Button type="submit" variant="contained" color="error" fullWidth sx={{ mt: 2 }}>
          {t('cancel_booking')}
        </Button>
      </form>
      {message && (
        <Typography 
          color={message === t('booking_cancelled') ? 'success.main' : 'error'} 
          sx={{ mt: 2 }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
}

export default CancelBooking;
