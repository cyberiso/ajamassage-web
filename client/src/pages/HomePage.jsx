import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Slider } from '@mui/material';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState([
    { text: 'Review 1 text', author: 'Author 1' },
    { text: 'Review 2 text', author: 'Author 2' },
    { text: 'Review 3 text', author: 'Author 3' },
    { text: 'Review 4 text', author: 'Author 4' },
    { text: 'Review 5 text', author: 'Author 5' },
  ]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  return (
    <Box sx={{ mt: 8, mb: 8 }}>
      <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
        {t('customer_reviews')}
      </Typography>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        gap: { xs: 4, md: 6 },
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Box sx={{ width: { xs: '100%', md: '45%' } }}>
          <Slider {...settings}>
            {reviews.map((review, index) => (
              <Box key={index} sx={{ px: 2 }}>
                <Card sx={{ height: '100%', p: 3 }}>
                  <CardContent>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {review.text}
                    </Typography>
                    <Typography variant="subtitle1" color="primary">
                      {review.author}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Slider>
        </Box>
        <Box sx={{ width: { xs: '100%', md: '45%' } }}>
          <Slider {...settings}>
            {reviews.map((review, index) => (
              <Box key={index} sx={{ px: 2 }}>
                <Card sx={{ height: '100%', p: 3 }}>
                  <CardContent>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {review.text}
                    </Typography>
                    <Typography variant="subtitle1" color="primary">
                      {review.author}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Slider>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage; 