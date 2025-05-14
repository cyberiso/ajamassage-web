// src/pages/CustomerReviews.jsx
import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Rating,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

function CustomerReviews() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // 600px altı mobil
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [approvedReviews, setApprovedReviews] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Onaylanmış yorumları çekme
  useEffect(() => {
    const fetchApprovedReviews = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/reviews/approved', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error(t('fetch_reviews_failed'));
        const data = await response.json();
        setApprovedReviews(data);
      } catch (error) {
        console.error('Onaylanmış yorumları çekme hatası:', error);
      }
    };

    fetchApprovedReviews();
  }, [t]);

  // Yeni yorum gönderme
  const handleSubmit = async () => {
    if (!rating || !comment) {
      setErrorMessage(t('rating_comment_required'));
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating, comment }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || t('review_submit_failed'));
      alert(t('review_submitted'));
      setRating(0);
      setComment('');
      setErrorMessage('');
    } catch (error) {
      console.error('Yorum gönderme hatası:', error);
      setErrorMessage(error.message);
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 }, // Mobilde 16px, büyük ekranlarda 32px
        maxWidth: '1200px',
        mx: 'auto',
      }}
    >
      <Typography variant={isMobile ? 'h5' : 'h4'} gutterBottom align="center">
        {t('customer_reviews')}
      </Typography>

      {/* Yorum Yapma Bölümü */}
      <Box
        sx={{
          p: { xs: 2, sm: 4 }, // Mobilde 16px, büyük ekranlarda 32px
          bgcolor: '#f5f5f5',
          borderRadius: '8px',
          mb: 4,
        }}
      >
        <Typography variant={isMobile ? 'h5' : 'h4'} gutterBottom>
          {t('share_your_opinion')}
        </Typography>
        <Rating
          value={rating}
          onChange={(event, newValue) => setRating(newValue)}
          sx={{ mb: 2 }}
          size={isMobile ? 'medium' : 'large'} // Mobilde medium ikon
        />
        <TextField
          fullWidth
          multiline
          rows={isMobile ? 3 : 4} // Mobilde 3 satır
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={t('write_your_comment')}
          sx={{ mb: 2 }}
          size={isMobile ? 'small' : 'medium'} // Mobilde küçük input
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          size={isMobile ? 'medium' : 'large'} // Mobilde medium buton
        >
          {t('submit')}
        </Button>
        {errorMessage && (
          <Typography
            variant={isMobile ? 'caption' : 'body2'}
            color="error"
            sx={{ mt: 1 }}
          >
            {errorMessage}
          </Typography>
        )}
      </Box>

      <Divider sx={{ mb: isMobile ? 2 : 4 }} /> {/* Mobilde boşluk 16px */}

      {/* Onaylanmış Yorumlar Bölümü */}
      <Typography variant={isMobile ? 'h6' : 'h5'} gutterBottom>
        {t('approved_reviews')}
      </Typography>
      {approvedReviews.length > 0 ? (
        <List>
          {approvedReviews.map((review) => (
            <ListItem
              key={review._id}
              sx={{
                flexDirection: 'column', // Hem mobil hem masaüstünde sütun düzeni
                alignItems: 'flex-start', // Sola hizalı
                py: isMobile ? 1 : 2, // Mobilde padding-y 8px, masaüstünde 16px
              }}
            >
              <Rating
                value={review.rating}
                readOnly
                size={isMobile ? 'small' : 'medium'} // Mobilde küçük yıldız
                sx={{ mb: 1 }} // Yıldızlar ile metin arasında boşluk
              />
              <ListItemText
                primary={review.comment}
                secondary={`${t('date')}: ${new Date(review.createdAt).toLocaleDateString()}`}
                primaryTypographyProps={{ variant: isMobile ? 'body2' : 'body1' }}
                secondaryTypographyProps={{ variant: isMobile ? 'caption' : 'body2' }}
              />
              <Divider sx={{ my: isMobile ? 1 : 2, width: '100%' }} /> {/* Mobilde boşluk 8px */}
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant={isMobile ? 'body2' : 'body1'} color="textSecondary">
          {t('no_approved_reviews')}
        </Typography>
      )}
    </Box>
  );
}

export default CustomerReviews;