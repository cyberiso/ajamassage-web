// src/components/admin/SliderManagementSection.jsx
import { useState } from 'react';
import {
  Typography,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import styles from '../../styles/AdminDashboard.module.css';

function SliderManagementSection({ sliders, setSliders }) {
  const [newSlider, setNewSlider] = useState({ image: null, title: '', description: '' });
  const [editSlider, setEditSlider] = useState(null);
  const token = localStorage.getItem('token');

  const handleSliderAdd = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', newSlider.image);
    formData.append('title', newSlider.title);
    formData.append('description', newSlider.description);

    try {
      const response = await fetch('http://localhost:5000/api/sliders', {
        method: 'POST',
        headers: { 'x-auth-token': token },
        body: formData,
      });
      if (!response.ok) throw new Error('Slider eklenemedi');
      const addedSlider = await response.json();
      setSliders([...sliders, addedSlider]);
      setNewSlider({ image: null, title: '', description: '' });
    } catch (error) {
      console.error('Slider ekleme hatası:', error);
      alert('Slider eklenemedi.');
    }
  };

  const handleSliderUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (editSlider.image) formData.append('image', editSlider.image);
    formData.append('title', editSlider.title);
    formData.append('description', editSlider.description || '');

    try {
      const response = await fetch(`http://localhost:5000/api/sliders/${editSlider._id}`, {
        method: 'PUT',
        headers: { 'x-auth-token': token },
        body: formData,
      });
      if (!response.ok) throw new Error('Slider güncellenemedi');
      const updatedSlider = await response.json();
      setSliders(sliders.map((s) => (s._id === editSlider._id ? updatedSlider : s)));
      setEditSlider(null);
    } catch (error) {
      console.error('Slider güncelleme hatası:', error);
      alert('Slider güncellenemedi.');
    }
  };

  const handleSliderDelete = async (id) => {
    if (!window.confirm('Bu slider’ı silmek istediğinizden emin misiniz?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/sliders/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token },
      });
      if (!response.ok) throw new Error('Slider silinemedi');
      setSliders(sliders.filter((s) => s._id !== id));
    } catch (error) {
      console.error('Slider silme hatası:', error);
      alert('Slider silinemedi.');
    }
  };

  const handleEditClick = (slide) => {
    setEditSlider({ ...slide, image: null });
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>Slider Yönetimi</Typography>
      <Box component="form" onSubmit={handleSliderAdd} sx={{ mb: 3 }}>
        <TextField
          label="Fotoğraf"
          type="file"
          onChange={(e) => setNewSlider({ ...newSlider, image: e.target.files[0] })}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          inputProps={{ accept: 'image/*' }}
          required
        />
        <TextField
          label="Başlık"
          value={newSlider.title}
          onChange={(e) => setNewSlider({ ...newSlider, title: e.target.value })}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Açıklama"
          value={newSlider.description}
          onChange={(e) => setNewSlider({ ...newSlider, description: e.target.value })}
          fullWidth
          margin="normal"
          multiline
          rows={2}
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Slider Ekle
        </Button>
      </Box>
      <Table className={styles.table}>
        <TableHead>
          <TableRow>
            <TableCell>Fotoğraf</TableCell>
            <TableCell>Başlık</TableCell>
            <TableCell>Açıklama</TableCell>
            <TableCell>İşlem</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sliders.map((slide) => (
            <TableRow key={slide._id}>
              <TableCell>
                <img
                  src={`http://localhost:5000${slide.imageUrl}`}
                  alt={slide.title || 'Slider'}
                  style={{ width: '100px', height: 'auto' }}
                  onError={(e) => (e.target.src = '/placeholder-image.jpg')}
                />
              </TableCell>
              <TableCell>{slide.title || '-'}</TableCell>
              <TableCell>{slide.description || '-'}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => handleEditClick(slide)}
                  sx={{ mr: 1 }}
                >
                  Düzenle
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleSliderDelete(slide._id)}
                >
                  Sil
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!editSlider} onClose={() => setEditSlider(null)}>
        <DialogTitle>Slider Düzenle</DialogTitle>
        <DialogContent>
          <TextField
            label="Fotoğraf (Değiştirmek istemiyorsanız boş bırakın)"
            type="file"
            onChange={(e) => setEditSlider({ ...editSlider, image: e.target.files[0] })}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            inputProps={{ accept: 'image/*' }}
          />
          <TextField
            label="Başlık"
            value={editSlider?.title || ''}
            onChange={(e) => setEditSlider({ ...editSlider, title: e.target.value })}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Açıklama"
            value={editSlider?.description || ''}
            onChange={(e) => setEditSlider({ ...editSlider, description: e.target.value })}
            fullWidth
            margin="normal"
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditSlider(null)} color="secondary">
            İptal
          </Button>
          <Button onClick={handleSliderUpdate} color="primary" variant="contained">
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default SliderManagementSection;