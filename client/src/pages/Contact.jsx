// src/pages/Contact.jsx
import { useState } from 'react';
import { Box, Typography, TextField, Button, Grid, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import StatsSection from '../components/StatsSection';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import styles from '../styles/Contact.module.css';

function Contact() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // 600px altı mobil
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: '',
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setSuccess(true);
        setFormData({ fullName: '', email: '', phone: '', message: '' });
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const errorData = await response.json();
        alert(`${t('error')}: ${errorData.message || t('message_failed')}`);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert(t('server_unreachable'));
    }
  };

  return (
    <Box
      className={styles.container}
      sx={{
        p: { xs: 2, sm: 4 }, // Mobilde 16px, büyük ekranlarda 32px
      }}
    >
      <Typography variant={isMobile ? 'h4' : 'h3'} gutterBottom align="center">
        {t('contact')}
      </Typography>
      <Grid container spacing={isMobile ? 2 : 4}> {/* Mobilde spacing 2 */}
        {/* İletişim Formu */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            className={styles.formPaper}
            sx={{ p: isMobile ? 2 : 3 }} // Mobilde 16px padding
          >
            <Typography variant={isMobile ? 'h6' : 'h5'} gutterBottom>
              {t('contact_us')}
            </Typography>
            {success && (
              <Typography
                color="success.main"
                variant={isMobile ? 'body2' : 'body1'}
                gutterBottom
              >
                {t('message_success')}
              </Typography>
            )}
            <form onSubmit={handleSubmit}>
              <TextField
                label={t('full_name')}
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                size={isMobile ? 'small' : 'medium'} // Mobilde küçük input
              />
              <TextField
                label={t('email')}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                size={isMobile ? 'small' : 'medium'}
              />
              <TextField
                label={t('phone_number')}
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                size={isMobile ? 'small' : 'medium'}
              />
              <TextField
                label={t('message')}
                name="message"
                value={formData.message}
                onChange={handleChange}
                fullWidth
                margin="normal"
                multiline
                rows={isMobile ? 3 : 4} // Mobilde 3 satır
                required
                size={isMobile ? 'small' : 'medium'}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                size={isMobile ? 'medium' : 'large'} // Mobilde medium buton
              >
                {t('send')}
              </Button>
            </form>
          </Paper>
        </Grid>

        {/* İletişim Bilgileri */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            className={styles.infoPaper}
            sx={{ p: isMobile ? 2 : 3 }} // Mobilde 16px padding
          >
            <Typography variant={isMobile ? 'h6' : 'h5'} gutterBottom>
              {t('contact_info')}
            </Typography>
            <Typography variant={isMobile ? 'body2' : 'body1'}>
              <strong>{t('address')}:</strong> {t('sample_address')}
            </Typography>
            <Typography variant={isMobile ? 'body2' : 'body1'}>
              <strong>{t('tel')}:</strong> {t('sample_phone')}
            </Typography>
            <Typography variant={isMobile ? 'body2' : 'body1'}>
              <strong>{t('email')}:</strong> {t('sample_email')} {/* Anahtar 'email_label' olarak değiştirildi */}
            </Typography>
            <Typography variant={isMobile ? 'body2' : 'body1'} sx={{ mt: 2 }}>
              <strong>{t('working_hours')}:</strong>
              <br />
              {t('working_hours_mon_sat')}
              <br />
              
            </Typography>
          </Paper>
        </Grid>

        {/* Harita */}
        <Grid item xs={12}>
          <Paper
            elevation={3}
            className={styles.mapPaper}
            sx={{ p: isMobile ? 2 : 3 }} // Mobilde 16px padding
          >
            <Typography variant={isMobile ? 'h6' : 'h5'} gutterBottom>
              {t('find_us_on_map')}
            </Typography>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3541.643533031812!2d6.928805756328241!3d51.1210023073461!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47bf339c6fc4d6c7%3A0x96f1829603f75075!2sAJA%20Massage-%20und%20Wellnesszentrum%20GmbH!5e0!3m2!1str!2str!4v1742844306369!5m2!1str!2str"
              width="100%"
              height={isMobile ? '200' : '300'} // Mobilde 200px
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title={t('map')}
            />
          </Paper>
        </Grid>
      </Grid>
      <StatsSection />
    </Box>
  );
}

export default Contact;
