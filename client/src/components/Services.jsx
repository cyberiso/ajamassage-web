// src/components/Services.jsx
import { Grid, Card, CardContent, Typography } from '@mui/material';
import styles from './Services.module.css';

function Services() {
  const services = [
    { title: 'Klasik Masaj', desc: 'Rahatlatıcı bir deneyim' },
    { title: 'Spor Masajı', desc: 'Kas ağrılarına son' },
    { title: 'Aromaterapi', desc: 'Doğal yağlarla huzur' },
  ];

  return (
    <div className={styles.services}>
      <Typography variant="h4" gutterBottom>
        Hizmetlerimiz
      </Typography>
      <Grid container spacing={3}>
        {services.map((service, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6">{service.title}</Typography>
                <Typography variant="body2">{service.desc}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
} 

export default Services;