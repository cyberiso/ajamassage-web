// src/App.jsx
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Box, ThemeProvider } from '@mui/material';
import { I18nextProvider } from 'react-i18next'; // i18n için provider
import i18n from './i18n'; // i18n yapılandırması
import theme from './theme/theme';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './components/Home';
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import About from './pages/About';
import Hakkimizda from './pages/Hakkimizda';
import Hizmetlerimiz from './pages/Hizmetlerimiz';
import Services from './pages/Services';
import Service from './pages/Service';
import Gallery from './pages/Gallery';
import Galeri from './pages/Galeri';
import Contact from './pages/Contact';
import CustomerReviews from './pages/CustomerReviews';
import BookingForm from './components/BookingForm';
import CancelBooking from './pages/CancelBooking';
import BookingPage from './pages/Booking';
import ReviewsSection from './components/ReviewsSection';
import ScrollToTop from './components/ScrollToTop';
import Treatments from './components/Treatments';
import Treatment from './pages/Treatment';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TestSocialMedia from './components/TestSocialMedia';
import WhatsAppFloatButton from './components/WhatsAppFloatButton';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Layout({ children }) {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminPage && <Header />}
      <Box sx={{ paddingTop: isAdminPage ? 0 : '112px' }}>
        {children}
        {!isAdminPage && <ReviewsSection />}
        {!isAdminPage && <Footer />}
        {!isAdminPage && <WhatsAppFloatButton />}
      </Box>
    </>
  );
}

function App() {
  useEffect(() => {
    // Uygulama başladığında Almanca dilini zorla
    if (!localStorage.getItem('i18nextLng')) {
      localStorage.setItem('i18nextLng', 'de');
      i18n.changeLanguage('de');
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <I18nextProvider i18n={i18n}> {/* i18n ile tüm uygulamayı sarıyoruz */}
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/hakkimizda" element={<Hakkimizda />} />        
              <Route path="/hizmetlerimiz" element={<Hizmetlerimiz />} />
              <Route path="/services" element={<Services />} />
              <Route path="/service/:id" element={<Service />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/galeri" element={<Galeri />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/customer-reviews" element={<CustomerReviews />} />
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/cancel" element={<CancelBooking />} />
              {/*
              <Route path="/physiotherapy" element={<Treatments />} />
              <Route path="/treatment/:id" element={<Treatment />} />
              Bunlar sonra yayınlanacak
              */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/termsandconditions" element={<TermsAndConditions />} />
              <Route path="/test-social" element={<TestSocialMedia />} />
            </Routes>        
            <ScrollToTop />
          </Layout>
        </Router>
      </I18nextProvider>
    </ThemeProvider>
  );
}

export default App;
