import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Grid,
  Button,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Phone,
  Email,
  Search,
  Person,
  Instagram,
  Facebook,
  Twitter,
  YouTube,
  LinkedIn,
  WhatsApp,
  Telegram,
  BookOnline,
  Cancel,
  Language,
  Menu as MenuIcon,
  Close,
} from "@mui/icons-material";
import { Dialog, DialogTitle, DialogContent, TextField, InputAdornment, List as MuiList, ListItem as MuiListItem, ListItemText as MuiListItemText, CircularProgress, Alert } from "@mui/material"; // Gerekli bileşenleri ekle
import { Link, useNavigate } from "react-router-dom"; // useNavigate ekle
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react'; // useEffect ve useCallback ekle
import styles from "./Header.module.css";
import useSettings from "../../hooks/useSettings";

// Türkiye bayrağı SVG (Gerçek oranlara uygun)
const FlagTR = () => (
  <svg width="24" height="16" viewBox="0 0 30 20" style={{ marginRight: '5px' }}>
    <rect width="30" height="20" fill="#e30a17" />
    <circle cx="11.5" cy="10" r="7.5" fill="#fff" />
    <circle cx="13" cy="10" r="6" fill="#e30a17" />
    <polygon
      points="18,6.5 19.5,10 23,10 20.25,12.5 21.5,16 18,13.5 14.5,16 15.75,12.5 13,10 16.5,10"
      fill="#fff"
    />
  </svg>
);

// Almanya bayrağı SVG
const FlagDE = () => (
  <svg width="20" height="20" viewBox="0 0 5 3" style={{ marginRight: '5px' }}>
    <rect width="5" height="1" fill="#000" />
    <rect y="1" width="5" height="1" fill="#d00" />
    <rect y="2" width="5" height="1" fill="#ffce00" />
  </svg>
);

// İngiltere bayrağı SVG
const FlagUK = () => (
  <svg width="24" height="16" viewBox="0 0 60 30" style={{ marginRight: '5px' }}>
    <rect width="60" height="30" fill="#012169"/>
    <rect width="60" height="6" fill="#C8102E" y="12"/>
    <rect width="6" height="30" fill="#C8102E" x="27"/>
    <rect width="40" height="6" fill="#C8102E" y="12" x="10"/>
    <rect width="6" height="30" fill="#C8102E" y="0" x="10"/>
    <rect width="60" height="2" fill="#FFFFFF" y="13"/>
    <rect width="2" height="30" fill="#FFFFFF" x="28"/>
    <rect width="42" height="2" fill="#FFFFFF" y="13" x="9"/>
    <rect width="2" height="30" fill="#FFFFFF" y="0" x="9"/>
  </svg>
);

function Header() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allServices, setAllServices] = useState([]); // Tüm hizmetleri sakla
  const [allTreatments, setAllTreatments] = useState([]); // Tüm tedavileri sakla
  const [searchLoading, setSearchLoading] = useState(false); // Arama veri yükleme durumu
  const [searchError, setSearchError] = useState(null); // Arama veri yükleme hatası
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const settings = useSettings();

  const handleLanguageMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguageMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSearchOpen = () => { // Arama pop-up'ını açma fonksiyonu
    setSearchOpen(true);
  };

  const handleSearchClose = () => { // Arama pop-up'ını kapatma fonksiyonu
     setSearchOpen(false);
     setSearchQuery(''); // Pop-up kapanınca sorguyu temizle
     setSearchResults([]); // Pop-up kapanınca sonuçları temizle
     setSearchError(null); // Hata varsa temizle
   };

   // Veri çekme fonksiyonu (useCallback ile optimize edilebilir)
   const fetchData = useCallback(async () => {
     if (allServices.length > 0 && allTreatments.length > 0) return; // Veri zaten çekilmişse tekrar çekme

     setSearchLoading(true);
     setSearchError(null);
     try {
       const [servicesRes, treatmentsRes] = await Promise.all([
         fetch('http://localhost:5000/api/services'),
         fetch('http://localhost:5000/api/treatments')
       ]);

       if (!servicesRes.ok) throw new Error(t('fetch_services_error'));
       if (!treatmentsRes.ok) throw new Error(t('fetch_treatments_error'));

       const servicesData = await servicesRes.json();
       const treatmentsData = await treatmentsRes.json();

       setAllServices(Array.isArray(servicesData) ? servicesData : []);
       setAllTreatments(Array.isArray(treatmentsData) ? treatmentsData : []);

     } catch (error) {
       console.error('Arama verisi çekme hatası:', error);
       setSearchError(error.message);
       setAllServices([]); // Hata durumunda boşalt
       setAllTreatments([]); // Hata durumunda boşalt
     } finally {
       setSearchLoading(false);
     }
   }, [t, allServices.length, allTreatments.length]); // Bağımlılıkları ekle

   // Arama pop-up'ı açıldığında veriyi çek
   useEffect(() => {
     if (searchOpen) {
       fetchData();
     }
   }, [searchOpen, fetchData]);


   const handleSearchChange = (event) => {
     const query = event.target.value.toLowerCase();
     setSearchQuery(event.target.value); // Input değerini güncelle

     if (query.length < 2) { // Çok kısa sorguları filtreleme
       setSearchResults([]);
       return;
     }

     if (searchLoading || searchError) return; // Yükleniyorsa veya hata varsa filtreleme yapma

     const currentLanguage = i18n.language.split('-')[0];

     const filteredServices = allServices
       .filter(service => service.name?.[currentLanguage]?.toLowerCase().includes(query))
       .map(service => ({ ...service, type: 'service' })); // Sonuca tip ekle

     const filteredTreatments = allTreatments
       .filter(treatment => treatment.name?.[currentLanguage]?.toLowerCase().includes(query))
       .map(treatment => ({ ...treatment, type: 'treatment' })); // Sonuca tip ekle

     setSearchResults([...filteredServices, ...filteredTreatments]);
   };

   // Sonuca tıklanınca ilgili sayfaya yönlendir
   const handleResultClick = (result) => {
     handleSearchClose(); // Pop-up'ı kapat
     if (result.type === 'service') {
       navigate(`/service/${result._id}`);
     } else if (result.type === 'treatment') {
       navigate(`/treatment/${result._id}`);
     }
   };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    handleLanguageMenuClose();
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const menuItems = [
    { text: t('home'), path: '/' },
    { text: t('about'), path: '/about' },
    { text: t('services'), path: '/services' },
    // { text: t('physiotherapy'), path: '/physiotherapy' }, fizyoterapi sonra eklenecek
    { text: t('gallery'), path: '/gallery' },
    { text: t('contact'), path: '/contact' },
  ];

  return (
    <Box sx={{ position: 'fixed', width: '100%', top: 0, zIndex: 1200 }}>
      <AppBar position="fixed" color="default" elevation={0} className={styles.topBar} sx={{ top: 0, zIndex: 1300 }}>
        <Toolbar variant="dense" sx={{ minHeight: { xs: 40, sm: 48 } }}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body2" className={styles.contactInfo}>
                  <Phone fontSize="small" /> {t('phone')}
                </Typography>
                {!isMobile && (
                  <>
                    <span className={styles.verticalDivider}></span>
                    <Typography variant="body2" className={styles.contactInfo}>
                      <Email fontSize="small" /> {t('e-mail')}
                    </Typography>
                  </>
                )}
              </Box>
            </Grid>
            <Grid item>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {settings.socialMedia?.instagram && (
                  <IconButton size="small" href={settings.socialMedia.instagram} target="_blank" aria-label="Instagram">
                    <Instagram />
                  </IconButton>
                )}
                {settings.socialMedia?.facebook && (
                  <IconButton size="small" href={settings.socialMedia.facebook} target="_blank" aria-label="Facebook">
                    <Facebook />
                  </IconButton>
                )}
                {settings.socialMedia?.twitter && (
                  <IconButton size="small" href={settings.socialMedia.twitter} target="_blank" aria-label="Twitter">
                    <Twitter />
                  </IconButton>
                )}
                {settings.socialMedia?.youtube && (
                  <IconButton size="small" href={settings.socialMedia.youtube} target="_blank" aria-label="YouTube">
                    <YouTube />
                  </IconButton>
                )}
                {settings.socialMedia?.linkedin && (
                  <IconButton size="small" href={settings.socialMedia.linkedin} target="_blank" aria-label="LinkedIn">
                    <LinkedIn />
                  </IconButton>
                )}
                {!isMobile && (
                  <>
                    <span className={styles.verticalDivider}></span>
                    <Typography
                      variant="body2"
                      component={Link}
                      to="/customer-reviews"
                      className={styles.customerReviewsLink}
                    >
                      {t('customer_reviews')}
                    </Typography>
                  </>
                )}
              </Box>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

      <AppBar position="fixed" color="primary" className={styles.mainBar} sx={{ top: { xs: '40px', sm: '48px' } }}>
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h6" component={Link} to="/" className={styles.logo}>
                Aja Massage
              </Typography>
            </Grid>
            
            {!isMobile ? (
              <>
                <Grid item>
                  <Box className={styles.menu}>
                    {menuItems.map((item) => (
                      <Link key={item.path} to={item.path} className={styles.menuItem}>
                        {item.text}
                      </Link>
                    ))}
                  </Box>
                </Grid>
                <Grid item>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton color="inherit" onClick={handleSearchOpen}> {/* onClick eklendi */}
                      <Search />
                    </IconButton>
                    <IconButton color="inherit" component={Link} to="/admin">
                      <Person />
                    </IconButton>
                    <Button
                      color="inherit"
                      onClick={() => navigate('/booking')}
                      startIcon={<BookOnline />}
                      sx={{ ml: 1 }}
                      className={styles.randevuButton}
                    >
                      {t('book_appointment')}
                    </Button>
                    <Button
                      color="inherit"
                      component={Link}
                      to="/cancel"
                      startIcon={<Cancel />}
                      sx={{ ml: 1 }}
                      className={styles.iptalButton}
                    >
                      {t('cancel_appointment')}
                    </Button>
                    <IconButton
                      color="inherit"
                      onClick={handleLanguageMenuOpen}
                      sx={{ ml: 1 }}
                    >
                      <Language />
                    </IconButton>
                  </Box>
                </Grid>
              </>
            ) : (
              <Grid item>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton
                    color="inherit"
                    onClick={toggleMobileMenu}
                    sx={{ mr: 1 }}
                  >
                    <MenuIcon />
                  </IconButton>
                </Box>
              </Grid>
            )}
          </Grid>
        </Toolbar>
      </AppBar>

      {/* Mobil Menü */}
      <Box className={styles.mobileMenu} sx={{ display: { xs: 'block', md: 'none' } }}>
        <IconButton
          onClick={toggleMobileMenu}
          className={styles.menuButton}
          aria-label="menu"
        >
          <MenuIcon />
        </IconButton>
        <Drawer
          anchor="right"
          open={mobileMenuOpen}
          onClose={toggleMobileMenu}
          className={styles.mobileDrawer}
        >
          <Box className={styles.mobileMenuContent}>
            <Box className={styles.mobileMenuHeader}>
              <IconButton
                onClick={toggleMobileMenu}
                className={styles.closeButton}
                aria-label="close menu"
              >
                <Close />
              </IconButton>
              <Box className={styles.languageButtons}>
                <Button
                  onClick={() => changeLanguage('tr')}
                  className={`${styles.languageButton} ${i18n.language === 'tr' ? styles.active : ''}`}
                >
                  TR
                </Button>
                <Button
                  onClick={() => changeLanguage('en')}
                  className={`${styles.languageButton} ${i18n.language === 'en' ? styles.active : ''}`}
                >
                  EN
                </Button>
                <Button
                  onClick={() => changeLanguage('de')}
                  className={`${styles.languageButton} ${i18n.language === 'de' ? styles.active : ''}`}
                >
                  DE
                </Button>
              </Box>
            </Box>
            <Box className={styles.mobileMenuLinks}>
              <List>
                {menuItems.map((item) => (
                  <ListItem
                    key={item.path}
                    component={Link}
                    to={item.path}
                    onClick={toggleMobileMenu}
                    className={styles.mobileMenuItem}
                  >
                    <ListItemText primary={item.text} />
                  </ListItem>
                ))}
                <Divider className={styles.mobileMenuDivider} />
                <ListItem
                  component={Button}
                  onClick={() => {
                    navigate('/booking');
                    toggleMobileMenu();
                  }}
                  className={styles.bookButton}
                  startIcon={<BookOnline />}
                >
                  {t('book_appointment')}
                </ListItem>
                <ListItem
                  component={Link}
                  to="/cancel"
                  onClick={toggleMobileMenu}
                  className={styles.mobileMenuButton}
                  startIcon={<Cancel sx={{ color: '#faf5ff' }} />}
                >
                  {t('cancel_appointment')}
                </ListItem>
              </List>
            </Box>
          </Box>
        </Drawer>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleLanguageMenuClose}
      >
        <MenuItem onClick={() => changeLanguage('tr')}>
          <FlagTR /> {t('turkish')}
        </MenuItem>
        <MenuItem onClick={() => changeLanguage('de')}>
          <FlagDE /> {t('german')}
        </MenuItem>
        <MenuItem onClick={() => changeLanguage('en')}>
          <FlagUK /> {t('english')}
        </MenuItem>
      </Menu>

      {/* Arama Pop-up Dialog */}
      <Dialog open={searchOpen} onClose={handleSearchClose} maxWidth="sm" fullWidth>
        <DialogTitle>{t('search')}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="search"
            label={t('search_placeholder')}
            type="search"
            fullWidth
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
             ),
             }}
             value={searchQuery} // TextField değerini state'e bağla
             onChange={handleSearchChange} // onChange olayını ekle
             // onKeyPress={(ev) => { // İsteğe bağlı: Enter'a basınca arama yapmak için
             //   if (ev.key === 'Enter') {
             //     performSearch(searchQuery);
             //     ev.preventDefault();
             //   }
             // }}
           />
           <Box mt={2} sx={{ minHeight: '100px', maxHeight: '400px', overflowY: 'auto' }}>
             {searchLoading && <CircularProgress size={24} />}
             {searchError && <Alert severity="error">{searchError}</Alert>}
             {!searchLoading && !searchError && searchResults.length === 0 && searchQuery.length > 1 && (
               <Typography variant="body2">{t('no_results_found')}</Typography>
             )}
             {!searchLoading && !searchError && searchResults.length > 0 && (
               <MuiList>
                 {searchResults.map((result) => {
                   const currentLanguage = i18n.language.split('-')[0];
                   const name = result.name?.[currentLanguage] || (result.type === 'service' ? t('service_not_found') : t('treatment_not_found')); // İsim yoksa çeviri kullan
                   const typeText = result.type === 'service' ? t('services') : t('physiotherapy'); // 'treatment' yerine 'physiotherapy' kullanıldı
                   return (
                     <MuiListItem button key={result._id} onClick={() => handleResultClick(result)}>
                       <MuiListItemText primary={name} secondary={typeText} />
                     </MuiListItem>
                   );
                 })}
               </MuiList>
             )}
           </Box>
         </DialogContent>
      </Dialog>
    </Box>
  );
}

export default Header;
