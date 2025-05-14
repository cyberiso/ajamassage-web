import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import useAdminData from '../../hooks/useAdminData';

const WhatsAppManagementSection = () => {
  const { whatsappReps, setWhatsappReps } = useAdminData();
  const [openDialog, setOpenDialog] = useState(false);
  const [currentRep, setCurrentRep] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEditing 
      ? `http://localhost:5000/api/whatsapp/${currentRep._id}`
      : 'http://localhost:5000/api/whatsapp';
      
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify(currentRep)
      });
      
      const data = await response.json();
      
      if(response.ok) {
        setWhatsappReps(prev => 
          isEditing 
            ? prev.map(r => r._id === data._id ? data : r)
            : [...prev, data]
        );
        handleCloseDialog();
      }
    } catch (error) {
      console.error('Hata:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/whatsapp/${id}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });
      setWhatsappReps(prev => prev.filter(r => r._id !== id));
    } catch (error) {
      console.error('Hata:', error);
    }
  };

  const handleOpenEdit = (rep) => {
    setCurrentRep(rep);
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleOpenNew = () => {
    setCurrentRep({ name: '', phone: '', welcomeMessage: '' });
    setIsEditing(false);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentRep({});
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">WhatsApp Temsilci Yönetimi</Typography>
        <Button variant="contained" onClick={handleOpenNew}>
          Yeni Temsilci Ekle
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ad</TableCell>
              <TableCell>Telefon</TableCell>
              <TableCell>Karşılama Mesajı</TableCell>
              <TableCell>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {whatsappReps.map((rep) => (
              <TableRow key={rep._id}>
                <TableCell>{rep.name}</TableCell>
                <TableCell>{rep.phone}</TableCell>
                <TableCell sx={{ maxWidth: 300 }}>{rep.welcomeMessage}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenEdit(rep)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(rep._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {isEditing ? 'Temsilci Düzenle' : 'Yeni Temsilci Ekle'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Temsilci Adı"
              value={currentRep.name || ''}
              onChange={(e) => setCurrentRep({...currentRep, name: e.target.value})}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Telefon Numarası"
              value={currentRep.phone || ''}
              onChange={(e) => setCurrentRep({...currentRep, phone: e.target.value})}
              required
              helperText="Örnek: 905554443322 (Ülke kodu ile birlikte)"
            />
            <TextField
              fullWidth
              margin="normal"
              label="Karşılama Mesajı"
              value={currentRep.welcomeMessage || ''}
              onChange={(e) => setCurrentRep({...currentRep, welcomeMessage: e.target.value})}
              required
              multiline
              rows={4}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>İptal</Button>
          <Button onClick={handleSubmit} variant="contained">
            {isEditing ? 'Güncelle' : 'Oluştur'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WhatsAppManagementSection;