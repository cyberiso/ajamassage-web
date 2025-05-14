// src/components/WhatsAppFloatButton.jsx
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Typography,
  useTheme,
  Avatar,
  ListItemAvatar,
  Divider
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const WhatsAppFloatButton = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [reps, setReps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const theme = useTheme();

  // Admin panelinde gizleme
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const fetchReps = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/whatsapp');
      if (!response.ok) throw new Error('Temsilciler yüklenemedi');
      const data = await response.json();
      setReps(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    if (!open) fetchReps();
    setOpen(!open);
  };

  const handleWhatsAppRedirect = (rep) => {
    try {
      // Telefon numarasını temizle ve formatla
      const cleanedPhone = rep.phone.replace(/[^\d]/g, '');
      const message = encodeURIComponent(rep.welcomeMessage);
      
      // WhatsApp deep link
      const whatsappUrl = `https://wa.me/${cleanedPhone}?text=${message}&app_absent=0&send=true`;
      
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      setError('WhatsApp bağlantı hatası');
    }
    setOpen(false);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 32,
        left: 32,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 1,
        maxWidth: 300
      }}
    >
      <IconButton
        color="primary"
        onClick={handleToggle}
        sx={{
          backgroundColor: '#25D366',
          color: 'white',
          '&:hover': { backgroundColor: '#128C7E' },
          transition: 'all 0.3s ease',
          boxShadow: 3,
          width: 56,
          height: 56
        }}
      >
        <WhatsAppIcon fontSize="large" />
        {open ? <ExpandLess sx={{ ml: 1 }} /> : <ExpandMore sx={{ ml: 1 }} />}
      </IconButton>

      <Collapse in={open} sx={{ width: '100%' }}>
        <Box
          sx={{
            backgroundColor: 'background.paper',
            borderRadius: 2,
            boxShadow: 3,
            overflow: 'hidden'
          }}
        >
          {loading && (
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
              <CircularProgress size={24} />
              <Typography variant="body2" sx={{ ml: 2 }}>Yükleniyor...</Typography>
            </Box>
          )}

          {error && (
            <Typography variant="body2" color="error" sx={{ p: 2 }}>
              {error}
            </Typography>
          )}

          {!loading && !error && (
            <List dense sx={{ py: 0 }}>
              {reps.map((rep, index) => (
                <React.Fragment key={rep._id}>
                  <ListItem 
                    component="button" // DOM uyarısını çözmek için
                    onClick={() => handleWhatsAppRedirect(rep)}
                    sx={{
                      cursor: 'pointer',
                      width: '100%',
                      '&:hover': { backgroundColor: theme.palette.action.hover }
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                        <WhatsAppIcon fontSize="small" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={rep.name}
                      secondary={
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                        >
                          {rep.phone}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < reps.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}

          {!loading && reps.length === 0 && (
            <Typography variant="body2" sx={{ p: 2, color: 'text.secondary' }}>
              Müsait temsilci bulunamadı
            </Typography>
          )}
        </Box>
      </Collapse>
    </Box>
  );
};

export default WhatsAppFloatButton;