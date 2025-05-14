import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';
import useSettings from '../hooks/useSettings';

const TestSocialMedia = () => {
  const settings = useSettings();
  
  console.log('Test Component Settings:', settings);
  console.log('Social Media in Test:', settings.socialMedia);
  
  return (
    <Paper sx={{ p: 3, m: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Sosyal Medya Ayarları Test Sayfası
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Ayarlar Durumu:
        </Typography>
        <Typography>
          Yükleniyor: {settings.loading ? 'Evet' : 'Hayır'}
        </Typography>
        <Typography>
          Hata: {settings.error || 'Yok'}
        </Typography>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Sosyal Medya Bağlantıları:
        </Typography>
        
        <List>
          {settings.socialMedia && Object.entries(settings.socialMedia).map(([platform, url]) => (
            <ListItem key={platform} divider>
              <ListItemText 
                primary={`${platform.charAt(0).toUpperCase() + platform.slice(1)}`} 
                secondary={url ? (
                  <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
                ) : 'Ayarlanmamış'}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Paper>
  );
};

export default TestSocialMedia;
