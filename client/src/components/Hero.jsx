// src/components/Hero.jsx
import { Button, Typography } from '@mui/material';
import styles from './Hero.module.css';

function Hero() {
  return (
    <div className={styles.hero}>
      <Typography variant="h2" gutterBottom>
        Rahatlamanın Adresi
      </Typography>
      <Typography variant="body1" gutterBottom>
        Profesyonel masaj hizmetlerimizle tanışın.
      </Typography>
      <Button variant="contained" color="primary">
        Randevu Al
      </Button>
    </div>
  );
}

export default Hero;