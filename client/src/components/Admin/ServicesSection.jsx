import { useState } from 'react';
import {
  Typography,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
  Button,
  TextField,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import styles from '../../styles/AdminDashboard.module.css';

function ServicesSection({ services, setServices }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState({ tr: '', de: '', en: '' });
  const [newService, setNewService] = useState({
    name: { tr: '', de: '', en: '' },
    description: { tr: '', de: '', en: '' },
    image: '',
    duration: '',
    price: '',
  });
  const [editService, setEditService] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  const handleAddService = async () => {
    if (!token) {
      setError('Please log in first.');
      return;
    }
    try {
      const serviceData = {
        name: { tr: newService.name.tr, de: newService.name.de, en: newService.name.en },
        description: { tr: newService.description.tr, de: newService.description.de, en: newService.description.en },
        image: newService.image,
        duration: Number(newService.duration),
        price: Number(newService.price),
      };
      if (!serviceData.name.tr || !serviceData.name.de || !serviceData.name.en || !serviceData.duration || !serviceData.price) {
        throw new Error('Turkish, German, and English names, duration, and price fields are required.');
      }
      const response = await fetch('http://localhost:5000/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Güncellendi
        },
        body: JSON.stringify(serviceData),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Service could not be added');
      setServices([...services, result]);
      setNewService({ name: { tr: '', de: '', en: '' }, description: { tr: '', de: '', en: '' }, image: '', duration: '', price: '' });
      setOpenAdd(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditService = async () => {
    if (!token) {
      setError('Please log in first.');
      return;
    }
    try {
      const serviceData = {
        name: { tr: editService.name.tr, de: editService.name.de, en: editService.name.en },
        description: { tr: editService.description.tr, de: editService.description.de, en: editService.description.en },
        image: editService.image,
        duration: Number(editService.duration),
        price: Number(editService.price),
      };
      if (!serviceData.name.tr || !serviceData.name.de || !serviceData.name.en || !serviceData.duration || !serviceData.price) {
        throw new Error('Turkish, German, and English names, duration, and price fields are required.');
      }
      const response = await fetch(`http://localhost:5000/api/services/${editService._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Güncellendi
        },
        body: JSON.stringify(serviceData),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Service could not be updated');
      setServices(services.map((s) => (s._id === result._id ? result : s)));
      setEditService(null);
      setOpenEdit(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/services/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }, // Güncellendi
      });
      if (!response.ok) throw new Error('Service could not be deleted');
      setServices(services.filter((s) => s._id !== id));
      setError(null);
    } catch (err) {
      setError(err.message);
      alert('Service could not be deleted.');
    }
  };

  const handleOpenEdit = (service) => {
    setEditService({
      _id: service._id,
      name: { tr: service.name.tr, de: service.name.de, en: service.name.en || '' },
      description: { tr: service.description?.tr || '', de: service.description?.de || '', en: service.description?.en || '' },
      image: service.image || '',
      duration: service.duration.toString(),
      price: service.price.toString(),
    });
    setOpenEdit(true);
    setError(null);
  };

  const handleOpenView = (description) => {
    setSelectedDescription({ tr: description.tr || '-', de: description.de || '-', en: description.en || '-' });
    setOpenView(true);
  };

  const truncateText = (text, maxLength = 15) => {
    if (!text || text.length <= maxLength) return text || '-';
    return text.slice(0, maxLength) + '...';
  };

  const filteredServices = (services || []).filter((service) =>
    (service.name.tr || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (service.name.de || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (service.name.en || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (!services) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Services</Typography>
      <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          label="Search by Service Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 200 }}
        />
        <Button variant="contained" onClick={() => setOpenAdd(true)}>
          Add New Service
        </Button>
      </Box>
      <Table className={styles.table}>
        <TableHead>
          <TableRow>
            <TableCell>Name (TR)</TableCell>
            <TableCell>Name (DE)</TableCell>
            <TableCell>Name (EN)</TableCell>
            <TableCell>Image</TableCell>
            <TableCell>Description (TR)</TableCell>
            <TableCell>Description (DE)</TableCell>
            <TableCell>Description (EN)</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredServices
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((service) => (
              <TableRow key={service._id}>
                <TableCell>{service.name.tr || '-'}</TableCell>
                <TableCell>{service.name.de || '-'}</TableCell>
                <TableCell>{service.name.en || '-'}</TableCell>
                <TableCell>
                  <img
                    src={service.image || 'https://via.placeholder.com/50'}
                    alt={service.name.tr}
                    style={{ width: 50, height: 50 }}
                  />
                </TableCell>
                <TableCell>
                  {truncateText(service.description?.tr)}
                  <Button
                    size="small"
                    onClick={() => handleOpenView(service.description || { tr: '', de: '', en: '' })}
                    sx={{ ml: 1 }}
                  >
                    View
                  </Button>
                </TableCell>
                <TableCell>
                  {truncateText(service.description?.de)}
                  <Button
                    size="small"
                    onClick={() => handleOpenView(service.description || { tr: '', de: '', en: '' })}
                    sx={{ ml: 1 }}
                  >
                    View
                  </Button>
                </TableCell>
                <TableCell>
                  {truncateText(service.description?.en)}
                  <Button
                    size="small"
                    onClick={() => handleOpenView(service.description || { tr: '', de: '', en: '' })}
                    sx={{ ml: 1 }}
                  >
                    View
                  </Button>
                </TableCell>
                <TableCell>{service.duration ? `${service.duration} min` : '-'}</TableCell>
                <TableCell>{service.price ? `${service.price}€` : '-'}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleOpenEdit(service)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(service._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={10}>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                count={filteredServices.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                component="div"
              />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      {/* Add New Service Dialog */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
        <DialogTitle>Add New Service</DialogTitle>
        <DialogContent>
          <TextField
            label="Service Name (Turkish)"
            fullWidth
            value={newService.name.tr}
            onChange={(e) => setNewService({ ...newService, name: { ...newService.name, tr: e.target.value } })}
            sx={{ mt: 2 }}
            autoFocus
          />
          <TextField
            label="Service Name (German)"
            fullWidth
            value={newService.name.de}
            onChange={(e) => setNewService({ ...newService, name: { ...newService.name, de: e.target.value } })}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Service Name (English)"
            fullWidth
            value={newService.name.en}
            onChange={(e) => setNewService({ ...newService, name: { ...newService.name, en: e.target.value } })}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Image URL"
            fullWidth
            value={newService.image}
            onChange={(e) => setNewService({ ...newService, image: e.target.value })}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Description (Turkish)"
            fullWidth
            multiline
            rows={4}
            value={newService.description.tr}
            onChange={(e) => setNewService({ ...newService, description: { ...newService.description, tr: e.target.value } })}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Description (German)"
            fullWidth
            multiline
            rows={4}
            value={newService.description.de}
            onChange={(e) => setNewService({ ...newService, description: { ...newService.description, de: e.target.value } })}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Description (English)"
            fullWidth
            multiline
            rows={4}
            value={newService.description.en}
            onChange={(e) => setNewService({ ...newService, description: { ...newService.description, en: e.target.value } })}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Duration (minutes)"
            fullWidth
            type="number"
            value={newService.duration}
            onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Price (€)"
            fullWidth
            type="number"
            value={newService.price}
            onChange={(e) => setNewService({ ...newService, price: e.target.value })}
            sx={{ mt: 2 }}
          />
          {error && (
            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)}>Cancel</Button>
          <Button onClick={handleAddService} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Service Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Edit Service</DialogTitle>
        <DialogContent>
          {editService && (
            <>
              <TextField
                label="Service Name (Turkish)"
                fullWidth
                value={editService.name.tr}
                onChange={(e) => setEditService({ ...editService, name: { ...editService.name, tr: e.target.value } })}
                sx={{ mt: 2 }}
                autoFocus
              />
              <TextField
                label="Service Name (German)"
                fullWidth
                value={editService.name.de}
                onChange={(e) => setEditService({ ...editService, name: { ...editService.name, de: e.target.value } })}
                sx={{ mt: 2 }}
              />
              <TextField
                label="Service Name (English)"
                fullWidth
                value={editService.name.en}
                onChange={(e) => setEditService({ ...editService, name: { ...editService.name, en: e.target.value } })}
                sx={{ mt: 2 }}
              />
              <TextField
                label="Image URL"
                fullWidth
                value={editService.image}
                onChange={(e) => setEditService({ ...editService, image: e.target.value })}
                sx={{ mt: 2 }}
              />
              <TextField
                label="Description (Turkish)"
                fullWidth
                multiline
                rows={4}
                value={editService.description.tr}
                onChange={(e) => setEditService({ ...editService, description: { ...editService.description, tr: e.target.value } })}
                sx={{ mt: 2 }}
              />
              <TextField
                label="Description (German)"
                fullWidth
                multiline
                rows={4}
                value={editService.description.de}
                onChange={(e) => setEditService({ ...editService, description: { ...editService.description, de: e.target.value } })}
                sx={{ mt: 2 }}
              />
              <TextField
                label="Description (English)"
                fullWidth
                multiline
                rows={4}
                value={editService.description.en}
                onChange={(e) => setEditService({ ...editService, description: { ...editService.description, en: e.target.value } })}
                sx={{ mt: 2 }}
              />
              <TextField
                label="Duration (minutes)"
                fullWidth
                type="number"
                value={editService.duration}
                onChange={(e) => setEditService({ ...editService, duration: e.target.value })}
                sx={{ mt: 2 }}
              />
              <TextField
                label="Price (€)"
                fullWidth
                type="number"
                value={editService.price}
                onChange={(e) => setEditService({ ...editService, price: e.target.value })}
                sx={{ mt: 2 }}
              />
              {error && (
                <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button onClick={handleEditService} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* View Description Dialog */}
      <Dialog open={openView} onClose={() => setOpenView(false)}>
        <DialogTitle>Description Details</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" gutterBottom>Turkish:</Typography>
          <Typography variant="body1">{selectedDescription.tr}</Typography>
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>German:</Typography>
          <Typography variant="body1">{selectedDescription.de}</Typography>
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>English:</Typography>
          <Typography variant="body1">{selectedDescription.en}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenView(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ServicesSection;
