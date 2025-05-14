// src/components/admin/AdminDrawer.jsx
import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Healing as HealingIcon,
  People as PeopleIcon,
  Message as MessageIcon,
  Event as EventIcon,
  Slideshow as SlideshowIcon,
  RateReview as RateReviewIcon,
  Photo as PhotoIcon,
  LocalHospital as LocalHospitalIcon,
  Home as HomeIcon,
  Settings as SettingsIcon,
  Tune as TuneIcon, // Yeni eklendi
} from '@mui/icons-material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

function AdminDrawer({
  mobileOpen,
  handleDrawerToggle,
  selectedSection,
  handleMenuClick,
  drawerWidth,
}) {
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon /> },
    { text: 'Hizmetlerimiz', icon: <LocalHospitalIcon /> },
    { text: 'Fizyoterapi', icon: <HealingIcon /> },
    { text: 'Kullanıcılar', icon: <PeopleIcon /> },
    { text: 'Mesajlar', icon: <MessageIcon /> },
    { text: 'Randevular', icon: <EventIcon /> },
    { text: 'Slider Yönetimi', icon: <SlideshowIcon /> },
    { text: 'Müşteri Yorumları', icon: <RateReviewIcon /> },
    { text: 'Galeri', icon: <PhotoIcon /> },
    { text: 'WhatsApp Yönetimi', icon: <WhatsAppIcon /> },
    // { text: 'Sistem Ayarları', icon: <SettingsIcon /> }, // Kaldırıldı
    { text: 'Site Ayarları', icon: <TuneIcon /> }, 
  ];

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            selected={selectedSection === item.text}
            onClick={() => handleMenuClick(item.text)}
            sx={{
              '&.Mui-selected': {
                backgroundColor: '#1976d2',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
              },
            }}
          >
            <ListItemIcon sx={{ 
              color: selectedSection === item.text ? '#ff9800' : 'inherit', // Turuncu renk eklendi
              '&:hover': {
                color: selectedSection === item.text ? '#ff9800' : 'inherit'
              }
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <ListItem
          component="a"
          href="/"
          target="_blank"
          sx={{
            '&:hover': {
              backgroundColor: '#f5f5f5',
            },
          }}
        >
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Siteyi Gör" />
        </ListItem>
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="textSecondary">
          Sürüm: 1.0.0
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Tasarım: <a href="mailto:ismailhakkikoc@hotmail.com" style={{ color: '#1976d2', textDecoration: 'none' }}>İsmail Hakkı KOÇ</a>
        </Typography>        
        <Typography variant="body2" color="textSecondary">
          Whatsapp:{' '}
          <a
            href="https://wa.me/905443335711"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#1976d2', textDecoration: 'none' }}
          >
            +90 544 333 57 11
          </a>
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box component="nav">
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}

export default AdminDrawer;
