import React, { useState, useEffect } from 'react';
import { Button, Paper, Typography, Tabs, Tab, Box, TextField, Switch, FormControlLabel, CircularProgress } from '@mui/material'; // Switch, FormControlLabel, CircularProgress eklendi
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // ReactQuill CSS eklendi

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const SiteSettingsSection = () => {
  const { t } = useTranslation();
  const [siteName, setSiteName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [faviconUrl, setFaviconUrl] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isBookingEnabled, setIsBookingEnabled] = useState(true); // Randevu ayarı state'i
  const [isSaving, setIsSaving] = useState(false); // Kaydetme durumu için state
  
  // Sosyal medya ayarları için state'ler
  const [socialMedia, setSocialMedia] = useState({
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: '',
    linkedin: '',
    whatsapp: '',
    telegram: ''
  });
  // Diğer genel site ayarları buraya eklenebilir

  const initialPageContent = { tr: '', en: '', de: '' };
  const [aboutUsContent, setAboutUsContent] = useState(initialPageContent);
  const [termsContent, setTermsContent] = useState(initialPageContent);
  const [privacyPolicyContent, setPrivacyPolicyContent] = useState(initialPageContent);

  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get('/api/settings');
        setSiteName(data.siteName || '');
        setLogoUrl(data.logoUrl || '');
        setFaviconUrl(data.faviconUrl || '');
        setContactEmail(data.contactEmail || '');
        setContactPhone(data.contactPhone || '');
        setAddress(data.address || '');
        setIsBookingEnabled(data.isBookingEnabled === undefined ? true : data.isBookingEnabled); // isBookingEnabled eklendi
        setSocialMedia(data.socialMedia || {
          facebook: '',
          instagram: '',
          twitter: '',
          youtube: '',
          linkedin: '',
          whatsapp: '',
          telegram: ''
        });
        setAboutUsContent(data.aboutUs || initialPageContent);
        setTermsContent(data.termsAndConditions || initialPageContent);
        setPrivacyPolicyContent(data.privacyPolicy || initialPageContent);
      } catch (error) {
        console.error(t('admin.siteSettings.loadError'), error);
        alert(t('admin.siteSettings.loadError'));
      }
    };
    fetchSettings();
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [t]); // initialPageContent bağımlılık dizisinden çıkarıldı. ESLint uyarısını engellemek için not eklendi.

  const handleSaveAllSettings = async (sectionToAlert) => {
    const payload = {
      siteName,
      logoUrl,
      faviconUrl,
      contactEmail,
      contactPhone,
      address,
      isBookingEnabled, // isBookingEnabled eklendi
      socialMedia, // Sosyal medya ayarlarını ekle
      aboutUs: aboutUsContent,
      termsAndConditions: termsContent,
      privacyPolicy: privacyPolicyContent,
    };
    try {
      await axios.put('/api/settings', payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (sectionToAlert === 'general') {
        alert(t('admin.siteSettings.generalSettingsSaved'));
      } else {
        alert(t(`admin.siteSettings.${sectionToAlert}Saved`));
      }
    } catch (error) {
      console.error(t('admin.siteSettings.generalSettingsSaveError'), error);
      const errorMsg = error.response?.data?.message || error.message || t('admin.siteSettings.generalSettingsSaveError');
      if (sectionToAlert === 'general') {
        alert(`${t('admin.siteSettings.generalSettingsSaveError')}: ${errorMsg}`);
      } else {
        alert(`${t(`admin.siteSettings.${sectionToAlert}SaveError`)}: ${errorMsg}`);
      }
    } finally {
      setIsSaving(false); // Kaydetme işlemi bitti
    }
  };

  // handleGeneralSettingsSave ve handlePageContentSave fonksiyonları handleSaveAllSettings ile birleştirildiği için kaldırıldı.

  // handlePageContentChange fonksiyonu ReactQuill'den gelen HTML içeriğini alacak şekilde güncellendi
  const handlePageContentChange = (pageType, lang, htmlContent) => {
    if (pageType === 'aboutUs') {
      setAboutUsContent(prev => ({ ...prev, [lang]: htmlContent }));
    } else if (pageType === 'terms') {
      setTermsContent(prev => ({ ...prev, [lang]: htmlContent }));
    } else if (pageType === 'privacyPolicy') {
      setPrivacyPolicyContent(prev => ({ ...prev, [lang]: htmlContent }));
    }
  };

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        {t('admin.siteSettings.title')}
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={currentTab} onChange={handleTabChange} aria-label="site settings tabs">
          <Tab label={t('admin.siteSettings.generalSettings')} {...a11yProps(0)} />
          <Tab label="Sosyal Medya" {...a11yProps(1)} />
          <Tab label={t('admin.siteSettings.aboutUs')} {...a11yProps(2)} />
          <Tab label={t('admin.siteSettings.termsAndConditions')} {...a11yProps(3)} />
          <Tab label={t('admin.siteSettings.privacyPolicy')} {...a11yProps(4)} />
        </Tabs>
      </Box>

      <TabPanel value={currentTab} index={0}>
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          {t('admin.siteSettings.general')}
        </Typography>
        <TextField
          label={t('admin.siteSettings.siteName')}
          fullWidth
          margin="normal"
          value={siteName}
          onChange={(e) => setSiteName(e.target.value)}
        />
        <TextField
          label={t('admin.siteSettings.logoUrl')}
          fullWidth
          margin="normal"
          value={logoUrl}
          onChange={(e) => setLogoUrl(e.target.value)}
        />
        <TextField
          label={t('admin.siteSettings.faviconUrl')}
          fullWidth
          margin="normal"
          value={faviconUrl}
          onChange={(e) => setFaviconUrl(e.target.value)}
        />
        <TextField
          label={t('admin.siteSettings.contactEmail')}
          fullWidth
          margin="normal"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
        />
        <TextField
          label={t('admin.siteSettings.contactPhone')}
          fullWidth
          margin="normal"
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
        />
        <TextField
          label={t('admin.siteSettings.address')}
          fullWidth
          multiline
          rows={3}
          margin="normal"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        {/* Randevu Sistemi Ayarı */}
        <FormControlLabel
          control={
            <Switch
              checked={isBookingEnabled}
              onChange={(e) => setIsBookingEnabled(e.target.checked)}
              color="primary"
              disabled={isSaving} // Kaydederken devre dışı bırak
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography>Randevu Sistemi</Typography>
              {isSaving && <CircularProgress size={20} />} 
            </Box>
          }
          sx={{ mt: 2, display: 'block' }} // Switch'i ayrı satıra al
        />
         <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
          {isBookingEnabled
            ? 'Randevu sistemi şu anda aktif. Kullanıcılar randevu alabilir.'
            : 'Randevu sistemi şu anda kapalı. Kullanıcılar randevu alamaz.'}
        </Typography>
        {/* Kaydet Butonu */}
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => { setIsSaving(true); handleSaveAllSettings('general'); }} 
          sx={{ mt: 2 }}
          disabled={isSaving} // Kaydederken devre dışı bırak
        >
          {isSaving ? 'Kaydediliyor...' : t('admin.siteSettings.saveGeneralSettings')}
        </Button>
      </TabPanel>

      <TabPanel value={currentTab} index={1}>
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Sosyal Medya Ayarları
        </Typography>
        <Typography variant="body1" gutterBottom>
          Sosyal medya hesaplarınızın bağlantılarını aşağıya giriniz. Boş bırakılan alanlar web sitesinde gösterilmeyecektir.
        </Typography>
        
        <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
          <TextField
            label="Facebook"
            fullWidth
            value={socialMedia.facebook}
            onChange={(e) => setSocialMedia({...socialMedia, facebook: e.target.value})}
            placeholder="https://facebook.com/sayfaniz"
            helperText="Facebook sayfanızın tam URL'si"
            sx={{ mb: 2 }}
          />
          
          <TextField
            label="Instagram"
            fullWidth
            value={socialMedia.instagram}
            onChange={(e) => setSocialMedia({...socialMedia, instagram: e.target.value})}
            placeholder="https://instagram.com/kullaniciadiniz"
            helperText="Instagram sayfanızın tam URL'si"
            sx={{ mb: 2 }}
          />
          
          <TextField
            label="Twitter"
            fullWidth
            value={socialMedia.twitter}
            onChange={(e) => setSocialMedia({...socialMedia, twitter: e.target.value})}
            placeholder="https://twitter.com/kullaniciadiniz"
            helperText="Twitter sayfanızın tam URL'si"
            sx={{ mb: 2 }}
          />
          
          <TextField
            label="YouTube"
            fullWidth
            value={socialMedia.youtube}
            onChange={(e) => setSocialMedia({...socialMedia, youtube: e.target.value})}
            placeholder="https://youtube.com/channel/kanaliniz"
            helperText="YouTube kanalınızın tam URL'si"
            sx={{ mb: 2 }}
          />
          
          <TextField
            label="LinkedIn"
            fullWidth
            value={socialMedia.linkedin}
            onChange={(e) => setSocialMedia({...socialMedia, linkedin: e.target.value})}
            placeholder="https://linkedin.com/in/profiliniz"
            helperText="LinkedIn profilinizin tam URL'si"
            sx={{ mb: 2 }}
          />
          
          <TextField
            label="WhatsApp"
            fullWidth
            value={socialMedia.whatsapp}
            onChange={(e) => setSocialMedia({...socialMedia, whatsapp: e.target.value})}
            placeholder="https://wa.me/905xxxxxxxxx"
            helperText="WhatsApp iletişim linkiniz (https://wa.me/905xxxxxxxxx formatında)"
            sx={{ mb: 2 }}
          />
          
          <TextField
            label="Telegram"
            fullWidth
            value={socialMedia.telegram}
            onChange={(e) => setSocialMedia({...socialMedia, telegram: e.target.value})}
            placeholder="https://t.me/kullaniciadiniz"
            helperText="Telegram kanalınızın tam URL'si"
            sx={{ mb: 2 }}
          />
        </Box>
        
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => { setIsSaving(true); handleSaveAllSettings('socialMedia'); }} 
          sx={{ mt: 2 }}
          disabled={isSaving}
        >
          {isSaving ? <CircularProgress size={24} /> : 'Sosyal Medya Ayarlarını Kaydet'}
        </Button>
      </TabPanel>

      <TabPanel value={currentTab} index={2}>
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          {t('admin.siteSettings.editAboutUs')}
        </Typography>
        {['tr', 'en', 'de'].map((lang) => (
          <Box key={lang} sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              {`${t('admin.siteSettings.aboutUsContent')} (${lang.toUpperCase()})`}
            </Typography>
            <ReactQuill 
              theme="snow" 
              value={aboutUsContent[lang] || ''} 
              onChange={(content) => handlePageContentChange('aboutUs', lang, content)} 
              style={{ backgroundColor: 'white', marginBottom: '16px' }} // Arka plan ve boşluk
              modules={{ // Basit araç çubuğu
                toolbar: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{'list': 'ordered'}, {'list': 'bullet'}],
                  ['link', 'image'], // Resim ekleme kaldırılabilir
                  [{ 'color': [] }, { 'background': [] }], // Renk seçenekleri
                  ['clean']
                ]
              }}
            />
          </Box>
        ))}
        <Button variant="contained" color="primary" onClick={() => handleSaveAllSettings('aboutUs')} sx={{ mt: 2 }}>
          {t('admin.siteSettings.saveAboutUs')}
        </Button>
      </TabPanel>

      <TabPanel value={currentTab} index={3}>
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          {t('admin.siteSettings.editTermsAndConditions')}
        </Typography>
        {['tr', 'en', 'de'].map((lang) => (
          <Box key={lang} sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              {`${t('admin.siteSettings.termsAndConditionsContent')} (${lang.toUpperCase()})`}
            </Typography>
            <ReactQuill 
              theme="snow" 
              value={termsContent[lang] || ''} 
              onChange={(content) => handlePageContentChange('terms', lang, content)} 
              style={{ backgroundColor: 'white', marginBottom: '16px' }}
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{'list': 'ordered'}, {'list': 'bullet'}],
                  ['link', 'image'],
                  [{ 'color': [] }, { 'background': [] }],
                  ['clean']
                ]
              }}
            />
          </Box>
        ))}
        <Button variant="contained" color="primary" onClick={() => handleSaveAllSettings('terms')} sx={{ mt: 2 }}>
          {t('admin.siteSettings.saveTermsAndConditions')}
        </Button>
      </TabPanel>

      <TabPanel value={currentTab} index={4}>
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          {t('admin.siteSettings.editPrivacyPolicy')}
        </Typography>
        {['tr', 'en', 'de'].map((lang) => (
          <Box key={lang} sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              {`${t('admin.siteSettings.privacyPolicyContent')} (${lang.toUpperCase()})`}
            </Typography>
            <ReactQuill 
              theme="snow" 
              value={privacyPolicyContent[lang] || ''} 
              onChange={(content) => handlePageContentChange('privacyPolicy', lang, content)} 
              style={{ backgroundColor: 'white', marginBottom: '16px' }}
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{'list': 'ordered'}, {'list': 'bullet'}],
                  ['link', 'image'],
                  [{ 'color': [] }, { 'background': [] }],
                  ['clean']
                ]
              }}
            />
          </Box>
        ))}
        <Button variant="contained" color="primary" onClick={() => handleSaveAllSettings('privacyPolicy')} sx={{ mt: 2 }}>
          {t('admin.siteSettings.savePrivacyPolicy')}
        </Button>
      </TabPanel>
    </Paper>
  );
};

export default SiteSettingsSection;
