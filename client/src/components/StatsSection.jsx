// src/components/StatsSection.jsx
import { Box, Grid, Typography } from '@mui/material';
import {
  Spa as SpaIcon,
  SentimentSatisfiedAlt as SentimentSatisfiedAltIcon,
  People as PeopleIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Slider from 'react-slick'; // Slayt için kütüphane
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import styles from '../styles/StatsSection.module.css';

function StatsSection() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // 600px altı mobil

  const stats = [
    { label: 'service', value: '100+', icon: <SpaIcon /> },
    { label: 'happy_customers', value: '50+', icon: <SentimentSatisfiedAltIcon /> },
    { label: 'staff', value: '20+', icon: <PeopleIcon /> },
    { label: 'years_experience', value: '10+', icon: <HistoryIcon /> },
  ];

  // Slayt ayarları
  const sliderSettings = {
    dots: true, // Noktalı navigasyon
    infinite: true, // Sonsuz döngü
    speed: 500, // Geçiş hızı
    slidesToShow: 1, // Bir seferde 1 kart
    slidesToScroll: 1, // Bir seferde 1 kaydırma
    arrows: false, // Okları gizle (mobilde dokunmatik kaydırma yeterli)
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 }, // Mobilde 16px, büyük ekranlarda 32px
        maxWidth: '1200px',
        mx: 'auto',
        backgroundColor: '#f0f4f8', // Arka plan rengi sx ile taşındı
      }}
      className={styles.container}
    >
      <Typography
        variant={isMobile ? 'h6' : 'h5'} // Mobilde h6, büyük ekranlarda h5
        className={styles.title}
        textAlign="center"
      >
        {t('stats_title')}
      </Typography>
      {isMobile ? (
        <Slider {...sliderSettings}>
          {stats.map((stat, index) => (
            <Box key={index} sx={{ p: 1 }}>
              <Box className={styles.statCard}>
                <Box className={styles.statContent}>
                  <Box className={styles.icon}>{stat.icon}</Box>
                  <Box>
                    <Typography variant="h4" className={styles.statValue}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body1" className={styles.statLabel}>
                      {t(stat.label)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Slider>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={4} md={3} key={index}>
              <Box className={styles.statCard}>
                <Box className={styles.statContent}>
                  <Box className={styles.icon}>{stat.icon}</Box>
                  <Box>
                    <Typography variant="h4" className={styles.statValue}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body1" className={styles.statLabel}>
                      {t(stat.label)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default StatsSection;