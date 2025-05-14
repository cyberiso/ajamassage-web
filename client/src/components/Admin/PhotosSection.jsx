// src/components/admin/PhotosSection.jsx
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
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import styles from '../../styles/AdminDashboard.module.css';

function PhotosSection({ photos, setPhotos }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [newPhoto, setNewPhoto] = useState(null); // Yeni dosya
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const handleAddPhoto = async () => {
    if (!token) {
      setError('Lütfen önce giriş yapın.');
      return;
    }
    if (!newPhoto) {
      setError('Lütfen bir fotoğraf seçin.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('photo', newPhoto);

      const response = await fetch('http://localhost:5000/api/photos', {
        method: 'POST',
        headers: { 'x-auth-token': token },
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Fotoğraf eklenemedi');
      setPhotos([result, ...photos]); // En son eklenen başa
      setNewPhoto(null);
      setError('');
      setOpenAdd(false);
    } catch (error) {
      console.error('Fotoğraf ekleme hatası:', error);
      setError(error.message);
    }
  };

  const handleEditPhoto = async () => {
    if (!token) {
      setError('Lütfen önce giriş yapın.');
      return;
    }
    if (!selectedPhoto || !newPhoto) {
      setError('Lütfen bir fotoğraf seçin.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('photo', newPhoto);

      const response = await fetch(`http://localhost:5000/api/photos/${selectedPhoto._id}`, {
        method: 'PUT',
        headers: { 'x-auth-token': token },
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Fotoğraf güncellenemedi');
      setPhotos(photos.map((p) => (p._id === result._id ? result : p)));
      setNewPhoto(null);
      setSelectedPhoto(null);
      setError('');
      setOpenEdit(false);
    } catch (error) {
      console.error('Fotoğraf güncelleme hatası:', error);
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/photos/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token },
      });
      if (!response.ok) throw new Error('Fotoğraf silinemedi');
      setPhotos(photos.filter((p) => p._id !== id));
    } catch (error) {
      console.error('Silme hatası:', error);
      alert('Fotoğraf silinemedi.');
    }
  };

  const handleOpenEdit = (photo) => {
    setSelectedPhoto(photo);
    setNewPhoto(null); // Yeni dosya seçimi için sıfırla
    setOpenEdit(true);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (!photos) return <Typography>Yükleniyor...</Typography>;

  return (
    <>
      <Typography variant="h4" gutterBottom>Galeri</Typography>
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" onClick={() => setOpenAdd(true)}>
          Yeni Fotoğraf Ekle
        </Button>
      </Box>
      <Table className={styles.table}>
        <TableHead>
          <TableRow>
            <TableCell>Fotoğraf</TableCell>
            <TableCell>İşlem</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
  {photos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((photo) => (
    <TableRow key={photo._id}>
      <TableCell>
        <img
          src={`http://localhost:5000${photo.url}`} // Tam URL
          alt="Galeri"
          style={{ width: 100, height: 100, objectFit: 'cover' }}
        />
      </TableCell>
      <TableCell>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => handleOpenEdit(photo)}
          sx={{ mr: 1 }}
        >
          Düzenle
        </Button>
        <Button variant="contained" color="error" size="small" onClick={() => handleDelete(photo._id)}>
          Sil
        </Button>
      </TableCell>
    </TableRow>
  ))}
</TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={photos.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Yeni Fotoğraf Ekleme Dialog */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
        <DialogTitle>Yeni Fotoğraf Ekle</DialogTitle>
        <DialogContent>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewPhoto(e.target.files[0])}
            style={{ marginTop: 16 }}
          />
          {error && (
            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)}>İptal</Button>
          <Button onClick={handleAddPhoto} variant="contained">Ekle</Button>
        </DialogActions>
      </Dialog>

      {/* Fotoğraf Düzenleme Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Fotoğrafı Düzenle</DialogTitle>
        <DialogContent>
          {selectedPhoto && (
            <>
              <img
                src={selectedPhoto.url}
                alt="Mevcut Fotoğraf"
                style={{ width: 100, height: 100, objectFit: 'cover', marginBottom: 16 }}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewPhoto(e.target.files[0])}
                style={{ marginTop: 16 }}
              />
            </>
          )}
          {error && (
            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>İptal</Button>
          <Button onClick={handleEditPhoto} variant="contained">Kaydet</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default PhotosSection;