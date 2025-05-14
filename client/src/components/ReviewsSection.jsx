// src/components/ReviewsSection.jsx
import { useState, useEffect } from 'react';
import { Box, Typography, Rating } from '@mui/material';
import Slider from 'react-slick';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import styles from '../styles/ReviewsSection.module.css';

function ReviewsSection() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // 600px altı mobil
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchApprovedReviews = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/reviews/approved', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error(t('fetch_reviews_failed'));
        const data = await response.json();
        setReviews(data.slice(-5));
      } catch (error) {
        console.error('Onaylanmış yorumları çekme hatası:', error);
      }
    };

    fetchApprovedReviews();
  }, [t]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: isMobile ? 1 : 3, // Mobilde 1, büyük ekranlarda 3
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: !isMobile, // Mobilde oklar gizlenir
    responsive: [
      {
        breakpoint: 960,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <Box
      className={styles.container}
      sx={{
        p: { xs: 2, sm: 4 }, // Mobilde 16px, büyük ekranlarda 32px
      }}
    >
      <Typography
        variant={isMobile ? 'h6' : 'h5'}
        className={styles.title}
        gutterBottom
      >
        {t('customer_reviews')}
      </Typography>
      {reviews.length > 0 ? (
        <Slider {...settings}>
          {reviews.map((review) => (
            <Box key={review._id} className={styles.reviewSlide}>
              <Rating
                value={review.rating}
                readOnly
                size={isMobile ? 'small' : 'medium'} // Mobilde küçük yıldız
              />
              <Typography
                variant={isMobile ? 'body2' : 'body1'}
                className={styles.comment}
              >
                "{review.comment}"
              </Typography>
              <Typography
                variant={isMobile ? 'caption' : 'body2'}
                className={styles.date}
              >
                {new Date(review.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          ))}
        </Slider>
      ) : (
        <Typography
          variant={isMobile ? 'body2' : 'body1'}
          className={styles.noReviews}
        >
          {t('no_reviews_yet')}
        </Typography>
      )}
    </Box>
  );
}

export default ReviewsSection;