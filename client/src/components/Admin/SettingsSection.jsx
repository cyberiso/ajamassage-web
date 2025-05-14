import { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Switch,
  FormControlLabel,
  Alert,
  Paper,
  CircularProgress,
} from '@mui/material';

function SettingsSection() {
  const [isBookingEnabled, setIsBookingEnabled] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/settings');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched settings:', data);
      setIsBookingEnabled(data.isBookingEnabled);
    } catch (err) {
      console.error('Settings fetch error:', err);
      setError('Ayarlar yüklenirken bir hata oluştu: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingToggle = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      console.log('Sending update request with value:', !isBookingEnabled);
      
      const response = await fetch('http://localhost:5000/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({
          isBookingEnabled: !isBookingEnabled,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ayar güncellenemedi');
      }

      const data = await response.json();
      console.log('Settings update response:', data);
      
      setIsBookingEnabled(data.isBookingEnabled);
      setSuccess('Ayar başarıyla güncellendi.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Settings update error:', err);
      setError('Ayar güncellenirken bir hata oluştu: ' + err.message);
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Sistem Ayarları
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={isBookingEnabled}
              onChange={handleBookingToggle}
              color="primary"
              disabled={loading}
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography>Randevu Sistemi</Typography>
              {loading && <CircularProgress size={20} />}
            </Box>
          }
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {isBookingEnabled
            ? 'Randevu sistemi şu anda aktif. Kullanıcılar randevu alabilir.'
            : 'Randevu sistemi şu anda kapalı. Kullanıcılar randevu alamaz.'}
        </Typography>
      </Paper>
    </Box>
  );
}

export default SettingsSection; 