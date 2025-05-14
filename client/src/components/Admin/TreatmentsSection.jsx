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
  Card,
  CardContent,
  CardActions,
  useMediaQuery,
  Grid,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import styles from '../../styles/AdminDashboard.module.css';

function TreatmentsSection({ treatments, setTreatments }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // 600px altı mobil
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState({ tr: '', de: '' });
  const [newTreatment, setNewTreatment] = useState({
    name: { tr: '', de: '' },
    description: { tr: '', de: '' },
    image: '',
    duration: '',
    price: '',
  });
  const [editTreatment, setEditTreatment] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  const handleAddTreatment = async () => {
    if (!token) {
      setError('Lütfen önce giriş yapın.');
      return;
    }
    try {
      const treatmentData = {
        name: { tr: newTreatment.name.tr, de: newTreatment.name.de },
        description: { tr: newTreatment.description.tr, de: newTreatment.description.de },
        image: newTreatment.image,
        duration: Number(newTreatment.duration),
        price: Number(newTreatment.price),
      };
      if (!treatmentData.name.tr || !treatmentData.name.de || !treatmentData.duration || !treatmentData.price) {
        throw new Error('Türkçe ve Almanca ad, süre ve fiyat alanları zorunludur.');
      }
      const response = await fetch('http://localhost:5000/api/treatments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(treatmentData),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Tedavi eklenemedi');
      setTreatments([...treatments, result]);
      setNewTreatment({ name: { tr: '', de: '' }, description: { tr: '', de: '' }, image: '', duration: '', price: '' });
      setOpenAdd(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditTreatment = async () => {
    if (!token) {
      setError('Lütfen önce giriş yapın.');
      return;
    }
    try {
      const treatmentData = {
        name: { tr: editTreatment.name.tr, de: editTreatment.name.de },
        description: { tr: editTreatment.description.tr, de: editTreatment.description.de },
        image: editTreatment.image,
        duration: Number(editTreatment.duration),
        price: Number(editTreatment.price),
      };
      if (!treatmentData.name.tr || !treatmentData.name.de || !treatmentData.duration || !treatmentData.price) {
        throw new Error('Türkçe ve Almanca ad, süre ve fiyat alanları zorunludur.');
      }
      const response = await fetch(`http://localhost:5000/api/treatments/${editTreatment._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(treatmentData),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Tedavi güncellenemedi');
      setTreatments(treatments.map((t) => (t._id === result._id ? result : t)));
      setEditTreatment(null);
      setOpenEdit(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/treatments/${id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token },
      });
      if (!response.ok) throw new Error('Tedavi silinemedi');
      setTreatments(treatments.filter((t) => t._id !== id));
      setError(null);
    } catch (err) {
      setError(err.message);
      alert('Tedavi silinemedi.');
    }
  };

  const handleOpenEdit = (treatment) => {
    setEditTreatment({
      _id: treatment._id,
      name: { tr: treatment.name.tr, de: treatment.name.de },
      description: { tr: treatment.description?.tr || '', de: treatment.description?.de || '' },
      image: treatment.image || '',
      duration: treatment.duration.toString(),
      price: treatment.price.toString(),
    });
    setOpenEdit(true);
    setError(null);
  };

  const handleOpenView = (description) => {
    setSelectedDescription({ tr: description?.tr || '-', de: description?.de || '-' });
    setOpenView(true);
  };

  const filteredTreatments = (treatments || []).filter((treatment) =>
    (treatment.name.tr || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (treatment.name.de || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const truncateDescription = (text) => {
    if (!text) return '-';
    return text.length > 15 ? `${text.substring(0, 15)}...` : text;
  };

  if (!treatments) return <Typography>Yükleniyor...</Typography>;

  return (
    <Box sx={{ p: { xs: 1, sm: 3 } }}>
      <Typography variant="h4" gutterBottom>Fizyoterapi Hizmetleri</Typography>
      <Box sx={{ mb: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: 'center' }}>
        <TextField
          label="Tedavi Adı ile Ara"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: { xs: '100%', sm: 200 } }}
        />
        <Button variant="contained" onClick={() => setOpenAdd(true)} fullWidth={isMobile}>
          Yeni Tedavi Ekle
        </Button>
      </Box>

      {/* Mobil için kartlar, masaüstü için tablo */}
      {isMobile ? (
        <Box>
          {filteredTreatments
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((treatment) => (
              <Card key={treatment._id} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography><strong>Ad (TR):</strong> {treatment.name.tr || '-'}</Typography>
                  <Typography><strong>Ad (DE):</strong> {treatment.name.de || '-'}</Typography>
                  <Typography>
                    <strong>Fotoğraf:</strong>
                    <img
                      src={treatment.image || 'https://via.placeholder.com/50'}
                      alt={treatment.name.tr}
                      style={{ width: 50, height: 50, marginLeft: 8 }}
                    />
                  </Typography>
                  <Typography>
                    <strong>Açıklama (TR):</strong> {truncateDescription(treatment.description?.tr)}
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => handleOpenView(treatment.description)}
                      sx={{ ml: 1 }}
                    >
                      Görüntüle
                    </Button>
                  </Typography>
                  <Typography>
                    <strong>Açıklama (DE):</strong> {truncateDescription(treatment.description?.de)}
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => handleOpenView(treatment.description)}
                      sx={{ ml: 1 }}
                    >
                      Görüntüle
                    </Button>
                  </Typography>
                  <Typography><strong>Süre:</strong> {treatment.duration ? `${treatment.duration} dk` : '-'}</Typography>
                  <Typography><strong>Fiyat:</strong> {treatment.price ? `${treatment.price}€` : '-'}</Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleOpenEdit(treatment)}
                  >
                    Düzenle
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(treatment._id)}
                  >
                    Sil
                  </Button>
                </CardActions>
              </Card>
            ))}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            count={filteredTreatments.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ mt: 2 }}
          />
        </Box>
      ) : (
        <Table className={styles.table}>
          <TableHead>
            <TableRow>
              <TableCell>Ad (TR)</TableCell>
              <TableCell>Ad (DE)</TableCell>
              <TableCell>Fotoğraf</TableCell>
              <TableCell>Açıklama (TR)</TableCell>
              <TableCell>Açıklama (DE)</TableCell>
              <TableCell>Süre</TableCell>
              <TableCell>Fiyat</TableCell>
              <TableCell>İşlem</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTreatments
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((treatment) => (
                <TableRow key={treatment._id}>
                  <TableCell>{treatment.name.tr || '-'}</TableCell>
                  <TableCell>{treatment.name.de || '-'}</TableCell>
                  <TableCell>
                    <img
                      src={treatment.image || 'https://via.placeholder.com/50'}
                      alt={treatment.name.tr}
                      style={{ width: 50, height: 50 }}
                    />
                  </TableCell>
                  <TableCell>
                    {truncateDescription(treatment.description?.tr)}
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => handleOpenView(treatment.description)}
                      sx={{ ml: 1 }}
                    >
                      Görüntüle
                    </Button>
                  </TableCell>
                  <TableCell>
                    {truncateDescription(treatment.description?.de)}
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => handleOpenView(treatment.description)}
                      sx={{ ml: 1 }}
                    >
                      Görüntüle
                    </Button>
                  </TableCell>
                  <TableCell>{treatment.duration ? `${treatment.duration} dk` : '-'}</TableCell>
                  <TableCell>{treatment.price ? `${treatment.price}€` : '-'}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleOpenEdit(treatment)}
                      sx={{ mr: 1 }}
                    >
                      Düzenle
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleDelete(treatment._id)}
                    >
                      Sil
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={8}>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  count={filteredTreatments.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  component="div" // <td> yerine <div> kullanmasını sağlar
                />
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}

      {/* Ekleme Dialog */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} fullScreen={isMobile}>
        <DialogTitle>Yeni Fizyoterapi Hizmeti Ekle</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Tedavi Adı (Türkçe)"
                fullWidth
                value={newTreatment.name.tr}
                onChange={(e) => setNewTreatment({ ...newTreatment, name: { ...newTreatment.name, tr: e.target.value } })}
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Tedavi Adı (Almanca)"
                fullWidth
                value={newTreatment.name.de}
                onChange={(e) => setNewTreatment({ ...newTreatment, name: { ...newTreatment.name, de: e.target.value } })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Fotoğraf URL"
                fullWidth
                value={newTreatment.image}
                onChange={(e) => setNewTreatment({ ...newTreatment, image: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Açıklama (Türkçe)"
                fullWidth
                multiline
                rows={4}
                value={newTreatment.description.tr}
                onChange={(e) => setNewTreatment({ ...newTreatment, description: { ...newTreatment.description, tr: e.target.value } })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Açıklama (Almanca)"
                fullWidth
                multiline
                rows={4}
                value={newTreatment.description.de}
                onChange={(e) => setNewTreatment({ ...newTreatment, description: { ...newTreatment.description, de: e.target.value } })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Süre (dakika)"
                fullWidth
                type="number"
                value={newTreatment.duration}
                onChange={(e) => setNewTreatment({ ...newTreatment, duration: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Fiyat (€)"
                fullWidth
                type="number"
                value={newTreatment.price}
                onChange={(e) => setNewTreatment({ ...newTreatment, price: e.target.value })}
              />
            </Grid>
            {error && (
              <Grid item xs={12}>
                <Typography variant="body2" color="error">
                  {error}
                </Typography>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)}>İptal</Button>
          <Button onClick={handleAddTreatment} variant="contained">Ekle</Button>
        </DialogActions>
      </Dialog>

      {/* Düzenleme Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullScreen={isMobile}>
        <DialogTitle>Fizyoterapi Hizmetini Düzenle</DialogTitle>
        <DialogContent>
          {editTreatment && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  label="Tedavi Adı (Türkçe)"
                  fullWidth
                  value={editTreatment.name.tr}
                  onChange={(e) => setEditTreatment({ ...editTreatment, name: { ...editTreatment.name, tr: e.target.value } })}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Tedavi Adı (Almanca)"
                  fullWidth
                  value={editTreatment.name.de}
                  onChange={(e) => setEditTreatment({ ...editTreatment, name: { ...editTreatment.name, de: e.target.value } })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Fotoğraf URL"
                  fullWidth
                  value={editTreatment.image}
                  onChange={(e) => setEditTreatment({ ...editTreatment, image: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Açıklama (Türkçe)"
                  fullWidth
                  multiline
                  rows={4}
                  value={editTreatment.description.tr}
                  onChange={(e) => setEditTreatment({ ...editTreatment, description: { ...editTreatment.description, tr: e.target.value } })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Açıklama (Almanca)"
                  fullWidth
                  multiline
                  rows={4}
                  value={editTreatment.description.de}
                  onChange={(e) => setEditTreatment({ ...editTreatment, description: { ...editTreatment.description, de: e.target.value } })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Süre (dakika)"
                  fullWidth
                  type="number"
                  value={editTreatment.duration}
                  onChange={(e) => setEditTreatment({ ...editTreatment, duration: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Fiyat (€)"
                  fullWidth
                  type="number"
                  value={editTreatment.price}
                  onChange={(e) => setEditTreatment({ ...editTreatment, price: e.target.value })}
                />
              </Grid>
              {error && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="error">
                    {error}
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>İptal</Button>
          <Button onClick={handleEditTreatment} variant="contained">Kaydet</Button>
        </DialogActions>
      </Dialog>

      {/* Açıklama Pop-up */}
      <Dialog open={openView} onClose={() => setOpenView(false)} fullScreen={isMobile}>
        <DialogTitle>Tedavi Açıklaması</DialogTitle>
        <DialogContent>
          <Typography variant="h6">Türkçe:</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>{selectedDescription.tr}</Typography>
          <Typography variant="h6">Almanca:</Typography>
          <Typography variant="body1">{selectedDescription.de}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenView(false)} variant="contained">Kapat</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TreatmentsSection;