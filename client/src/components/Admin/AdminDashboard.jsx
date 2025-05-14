// src/components/admin/AdminDashboard.jsx
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  CssBaseline,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { Navigate, useNavigate } from "react-router-dom";
import AdminDrawer from "./AdminDrawer";
import DashboardSection from "./DashboardSection";
import ServicesSection from "./ServicesSection";
import PhotosSection from "./PhotosSection";
import UsersSection from "./UsersSection";
import MessagesSection from "./MessagesSection";
import BookingsSection from "./BookingsSection";
import SliderManagementSection from "./SliderManagementSection";
import CustomerReviewsSection from "./CustomerReviewsSection";
import TreatmentsSection from "./TreatmentsSection";
import useAdminData from "../../hooks/useAdminData";
import WhatsAppManagementSection from './WhatsAppManagementSection';
import SettingsSection from './SettingsSection';
import SiteSettingsSection from './SiteSettingsSection';
import ProfileSection from './ProfileSection'; // Profil sayfası eklendi

// ErrorBoundary bileşeni
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" color="error">
            Bir hata oluştu. Lütfen sayfayı yenileyin.
          </Typography>
        </Box>
      );
    }
    return this.props.children;
  }
}

function AdminDashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState("Dashboard");
  const [anchorEl, setAnchorEl] = useState(null);
  const {
    isAuthenticated,
    // isAdmin ve userRole şu anda kullanılmıyor, ileride rol kontrolü için kullanılacak
    bookings,
    messages,
    sliders,
    reviews,
    services,
    treatments,
    photos,
    setPhotos,
    setBookings,
    setMessages,
    setSliders,
    setReviews,
    setServices,
    setTreatments,
    error: dataError,
  } = useAdminData();
  const navigate = useNavigate();

  const drawerWidth = 240;

  // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }
  
  // Not: Admin rolü kontrolü geçici olarak devre dışı bırakıldı
  // Daha sonra aşağıdaki kodu aktif hale getirerek sadece admin kullanıcıların
  // yönetim paneline erişmesini sağlayabilirsiniz
  
  /*
  if (!isAdmin) {
    // Kullanıcı rolünü kontrol et ve uygun mesaj göster
    const message = userRole ? 
      `Admin paneline sadece yöneticiler erişebilir. Sizin rolünüz: ${userRole}` : 
      'Admin paneline sadece yöneticiler erişebilir.';
    
    // Oturumu kapat ve kullanıcıyı anasayfaya yönlendir
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    
    // Uyarı göster
    alert(message);
    
    return <Navigate to="/" />;
  }
  */

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleMenuClick = (text) => {
    setSelectedSection(text);
    setMobileOpen(false);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    handleMenuClose();
    navigate('/admin/login');
  };

  const renderContent = () => {
    if (dataError) {
      return (
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" color="error">
            Veri yüklenirken bir hata oluştu: {dataError}
          </Typography>
        </Box>
      );
    }

    switch (selectedSection) {
      case "Dashboard":
        return <DashboardSection />;
      case "Hizmetlerimiz":
        return (
          <ErrorBoundary>
            <ServicesSection services={services} setServices={setServices} />
          </ErrorBoundary>
        );
      case "Fizyoterapi":
        return (
          <ErrorBoundary>
            <TreatmentsSection treatments={treatments} setTreatments={setTreatments} />
          </ErrorBoundary>
        );
      case "Kullanıcılar":
        return <UsersSection />;
      case "Mesajlar":
        return (
          <MessagesSection messages={messages} setMessages={setMessages} />
        );
      case "Randevular":
        return (
          <BookingsSection bookings={bookings} setBookings={setBookings} />
        );
      case "Slider Yönetimi":
        return (
          <SliderManagementSection sliders={sliders} setSliders={setSliders} />
        );
      case "Müşteri Yorumları":
        return (
          <CustomerReviewsSection reviews={reviews} setReviews={setReviews} />
        );
      case "WhatsApp Yönetimi":
        return (
          <ErrorBoundary>
            <WhatsAppManagementSection />
          </ErrorBoundary>
        );
      case "Galeri":
        return <PhotosSection photos={photos} setPhotos={setPhotos} />;
      // case "Sistem Ayarları": // Kaldırıldı
      //  return <SettingsSection />; 
      case "Site Ayarları": 
        return <SiteSettingsSection />;
      case "Profil":
        return <ProfileSection />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          {/* Rengi doğrudan beyaz olarak ayarla */}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: '#fff' }}>Admin Paneli</Typography>
          {/* Rengi doğrudan beyaz olarak ayarla */}
          <IconButton sx={{ color: '#fff' }}>
            <SearchIcon />
          </IconButton>
          {/* Rengi doğrudan beyaz olarak ayarla */}
          <IconButton sx={{ color: '#fff' }} onClick={handleMenuOpen}>
            <PersonIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => { handleMenuClose(); setSelectedSection("Profil"); }}>Profil</MenuItem>
            <MenuItem onClick={handleLogout}>Çıkış</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <AdminDrawer
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        selectedSection={selectedSection}
        handleMenuClick={handleMenuClick}
        drawerWidth={drawerWidth}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: "64px",
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        {renderContent()}
      </Box>
    </Box>
  );
}

export default AdminDashboard;
