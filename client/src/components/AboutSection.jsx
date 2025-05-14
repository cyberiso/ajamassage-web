// src/components/AboutSection.jsx
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from '../styles/AboutSection.module.css';

function AboutSection() {
  const { t } = useTranslation();

  return (
    <Box className={styles.container}>
      <Typography variant="h4" className={styles.title} textAlign="center">
        {t('about_us')}
      </Typography>
      <Typography variant="body1" className={styles.text} textAlign="center">
        {t('about_section_text')}
      </Typography>
      <Box className={styles.buttonContainer}>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/about"
        >
          {t('more_info')}
        </Button>
      </Box>
    </Box>
  );
}

export default AboutSection;