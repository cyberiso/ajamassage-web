// src/components/admin/UsersSection.jsx
import { useState, useEffect } from 'react';
import {
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Paper,
  Box,
  Snackbar,
  Alert,
  Tooltip,
  CircularProgress,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

function UsersSection() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [editMode, setEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    active: true
  });

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // For development/testing, use mock data if no token is available
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, using mock data');
        const mockUsers = [
          { _id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin', active: true, registerDate: new Date() },
          { _id: '2', name: 'Test User', email: 'user@example.com', role: 'user', active: true, registerDate: new Date() }
        ];
        setUsers(mockUsers);
        setError(null);
        return;
      }
      
      console.log('Fetching users from API with token:', token);
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Kullanıcılar yüklenirken bir hata oluştu (${response.status})`);
      }
      
      const data = await response.json();
      console.log('Received users data:', data);
      setUsers(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message);
      showSnackbar(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    const newValue = name === 'active' ? checked : value;
    setFormData({
      ...formData,
      [name]: newValue
    });
  };

  // Show snackbar message
  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  // Open dialog to add new user
  const handleAddUser = () => {
    setEditMode(false);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'user',
      active: true
    });
    setOpenDialog(true);
  };

  // Open dialog to edit user
  const handleEditUser = (user) => {
    setEditMode(true);
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // Don't populate password for security
      role: user.role,
      active: user.active
    });
    setOpenDialog(true);
  };

  // Open confirmation dialog to delete user
  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  // Submit form to create or update user
  const handleSubmit = async () => {
    // Validate form
    if (!formData.name || !formData.email || (!editMode && !formData.password)) {
      showSnackbar('Lütfen tüm zorunlu alanları doldurun', 'error');
      return;
    }

    try {
      // For development/testing, simulate API call if no token is available
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, simulating API call');
        
        if (editMode) {
          // Simulate editing a user
          setUsers(users.map(user => 
            user._id === selectedUser._id ? 
              { ...user, ...formData, password: undefined } : 
              user
          ));
        } else {
          // Simulate adding a new user
          const newUser = {
            _id: Date.now().toString(),
            ...formData,
            password: undefined,
            registerDate: new Date()
          };
          setUsers([...users, newUser]);
        }
        
        setOpenDialog(false);
        showSnackbar(
          editMode ? 'Kullanıcı başarıyla güncellendi' : 'Kullanıcı başarıyla eklendi'
        );
        return;
      }
      
      console.log(`${editMode ? 'Updating' : 'Creating'} user:`, formData);
      const url = editMode ? `http://localhost:5000/api/users/${selectedUser._id}` : 'http://localhost:5000/api/users';
      const method = editMode ? 'PUT' : 'POST';
      
      // Only include password if it's provided or it's a new user
      const dataToSend = { ...formData };
      if (!dataToSend.password) delete dataToSend.password;
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `İşlem sırasında bir hata oluştu (${response.status})`);
      }

      const result = await response.json();
      console.log('API response:', result);
      
      // Close dialog and refresh user list
      setOpenDialog(false);
      fetchUsers();
      showSnackbar(
        editMode ? 'Kullanıcı başarıyla güncellendi' : 'Kullanıcı başarıyla eklendi'
      );
    } catch (err) {
      console.error('Error submitting user:', err);
      showSnackbar(err.message, 'error');
    }
  };

  // Delete user
  const handleDeleteUser = async () => {
    try {
      // For development/testing, simulate API call if no token is available
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, simulating delete API call');
        
        // Simulate deleting a user
        setUsers(users.filter(user => user._id !== selectedUser._id));
        setOpenDeleteDialog(false);
        showSnackbar('Kullanıcı başarıyla silindi');
        return;
      }
      
      console.log('Deleting user:', selectedUser);
      const response = await fetch(`http://localhost:5000/api/users/${selectedUser._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Kullanıcı silinirken bir hata oluştu (${response.status})`);
      }

      const result = await response.json().catch(() => ({}));
      console.log('Delete response:', result);
      
      // Close dialog and refresh user list
      setOpenDeleteDialog(false);
      fetchUsers();
      showSnackbar('Kullanıcı başarıyla silindi');
    } catch (err) {
      console.error('Error deleting user:', err);
      showSnackbar(err.message, 'error');
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString('tr-TR', options);
    } catch (error) {
      console.error('Date formatting error:', error);
      return dateString.toString();
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Kullanıcı Yönetimi</Typography>
        <Box>
          <Tooltip title="Yenile">
            <IconButton onClick={fetchUsers} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddUser}
            sx={{ ml: 1 }}
          >
            Yeni Kullanıcı
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      ) : (
        <Paper elevation={2} sx={{ overflow: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ad</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Durum</TableCell>
                <TableCell>Kayıt Tarihi</TableCell>
                <TableCell>İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Henüz kullanıcı bulunmuyor
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.role === 'admin' ? 'Yönetici' : 
                       user.role === 'editor' ? 'Editör' : 'Kullanıcı'}
                    </TableCell>
                    <TableCell>
                      <Tooltip title={user.active ? 'Aktif' : 'Pasif'}>
                        <Box component="span" sx={{
                          display: 'inline-block',
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: user.active ? 'success.main' : 'error.main',
                          mr: 1
                        }} />
                      </Tooltip>
                      {user.active ? 'Aktif' : 'Pasif'}
                    </TableCell>
                    <TableCell>{formatDate(user.registerDate)}</TableCell>
                    <TableCell>
                      <Tooltip title="Düzenle">
                        <IconButton onClick={() => handleEditUser(user)} size="small">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Sil">
                        <IconButton 
                          onClick={() => handleDeleteClick(user)} 
                          size="small" 
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* Add/Edit User Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editMode ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Ekle'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Ad Soyad"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              required={!editMode}
              fullWidth
              label={editMode ? 'Yeni Şifre (değiştirmek için doldurun)' : 'Şifre'}
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              helperText={editMode ? 'Şifreyi değiştirmek istemiyorsanız boş bırakın' : ''}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Rol</InputLabel>
              <Select
                name="role"
                value={formData.role}
                label="Rol"
                onChange={handleInputChange}
              >
                <MenuItem value="admin">Yönetici</MenuItem>
                <MenuItem value="editor">Editör</MenuItem>
                <MenuItem value="user">Kullanıcı</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.active}
                  onChange={handleInputChange}
                  name="active"
                  color="primary"
                />
              }
              label="Aktif"
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>İptal</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editMode ? 'Güncelle' : 'Ekle'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Kullanıcı Sil</DialogTitle>
        <DialogContent>
          <Typography>
            <strong>{selectedUser?.name}</strong> adlı kullanıcıyı silmek istediğinize emin misiniz?
            Bu işlem geri alınamaz.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>İptal</Button>
          <Button onClick={handleDeleteUser} color="error" variant="contained">
            Sil
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={6000} 
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default UsersSection;