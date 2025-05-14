import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Grid, 
  Avatar, 
  Divider, 
  CircularProgress, 
  Alert,
  Card,
  CardContent
} from '@mui/material';
import { Person as PersonIcon, Save as SaveIcon, Edit as EditIcon } from '@mui/icons-material';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const ProfileSection = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    role: '',
    createdAt: '',
    lastLogin: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Token'dan kullanıcı bilgilerini al
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Oturum bilgisi bulunamadı');
        }
        
        // Token'ı decode et
        const decoded = jwtDecode(token);
        
        // Kullanıcı bilgilerini API'den al
        const response = await axios.get(`/api/users/${decoded.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const userData = response.data;
        
        setUser({
          name: userData.name,
          email: userData.email,
          role: userData.role,
          createdAt: new Date(userData.createdAt).toLocaleDateString('tr-TR'),
          lastLogin: userData.lastLogin ? new Date(userData.lastLogin).toLocaleString('tr-TR') : 'Bilgi yok'
        });
        
        setFormData({
          name: userData.name,
          email: userData.email,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Profil bilgileri alınamadı:', err);
        setError('Profil bilgileri yüklenirken bir hata oluştu: ' + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Parola değişikliği yapılıyorsa kontrol et
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('Yeni parolalar eşleşmiyor');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      
      // Sadece değişen alanları içeren payload oluştur
      const payload = {
        name: formData.name
      };
      
      // Eğer parola değişikliği yapılıyorsa
      if (formData.currentPassword && formData.newPassword) {
        payload.currentPassword = formData.currentPassword;
        payload.newPassword = formData.newPassword;
      }
      
      // Kullanıcı bilgilerini güncelle
      await axios.put(`/api/users/${decoded.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Kullanıcı state'ini güncelle
      setUser(prev => ({
        ...prev,
        name: formData.name
      }));
      
      // Form verilerini güncelle
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      setSuccess('Profil bilgileriniz başarıyla güncellendi');
      setEditMode(false);
      setSaving(false);
    } catch (err) {
      console.error('Profil güncellenirken hata:', err);
      setError('Profil güncellenirken bir hata oluştu: ' + (err.response?.data?.message || err.message));
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Profil Bilgileri
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
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
              <Avatar
                sx={{ 
                  width: 120, 
                  height: 120, 
                  bgcolor: 'primary.main',
                  mb: 2
                }}
              >
                <PersonIcon sx={{ fontSize: 60 }} />
              </Avatar>
              
              <Typography variant="h6" gutterBottom>
                {user.name}
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
              
              <Box sx={{ mt: 2, width: '100%' }}>
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <strong>Rol:</strong> <span>{user.role === 'admin' ? 'Yönetici' : 'Kullanıcı'}</span>
                </Typography>
                
                <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <strong>Kayıt Tarihi:</strong> <span>{user.createdAt}</span>
                </Typography>
                
                <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>Son Giriş:</strong> <span>{user.lastLogin}</span>
                </Typography>
              </Box>
              
              <Button 
                variant="outlined" 
                startIcon={<EditIcon />} 
                sx={{ mt: 3 }}
                onClick={() => setEditMode(!editMode)}
              >
                {editMode ? 'Düzenlemeyi İptal Et' : 'Profili Düzenle'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {editMode ? 'Profil Bilgilerini Düzenle' : 'Hesap Bilgileri'}
              </Typography>
              
              {!editMode ? (
                <Box>
                  <Typography variant="body1" paragraph>
                    Profil bilgilerinizi görüntülüyorsunuz. Bilgilerinizi düzenlemek için "Profili Düzenle" butonuna tıklayın.
                  </Typography>
                  
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      <strong>Ad Soyad:</strong> {user.name}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      <strong>E-posta:</strong> {user.email}
                    </Typography>
                    
                    <Typography variant="body2">
                      <strong>Parola:</strong> ********
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Box component="form" onSubmit={handleSubmit} noValidate>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Ad Soyad"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={saving}
                  />
                  
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="E-posta Adresi"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={true} // E-posta değiştirilemez
                  />
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Typography variant="subtitle1" gutterBottom>
                    Parola Değiştir (İsteğe Bağlı)
                  </Typography>
                  
                  <TextField
                    margin="normal"
                    fullWidth
                    name="currentPassword"
                    label="Mevcut Parola"
                    type="password"
                    id="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    disabled={saving}
                  />
                  
                  <TextField
                    margin="normal"
                    fullWidth
                    name="newPassword"
                    label="Yeni Parola"
                    type="password"
                    id="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    disabled={saving}
                  />
                  
                  <TextField
                    margin="normal"
                    fullWidth
                    name="confirmPassword"
                    label="Yeni Parola (Tekrar)"
                    type="password"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={saving}
                  />
                  
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    startIcon={<SaveIcon />}
                    sx={{ mt: 3, mb: 2 }}
                    disabled={saving}
                  >
                    {saving ? <CircularProgress size={24} /> : 'Değişiklikleri Kaydet'}
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ProfileSection;
