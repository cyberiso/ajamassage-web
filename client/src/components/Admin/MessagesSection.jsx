// src/components/admin/MessagesSection.jsx
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
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import styles from '../../styles/AdminDashboard.module.css';

function MessagesSection({ messages, setMessages }) {
  const [searchTermMessages, setSearchTermMessages] = useState('');
  const [filter, setFilter] = useState('all');
  const [pageMessages, setPageMessages] = useState(0);
  const [rowsPerPageMessages, setRowsPerPageMessages] = useState(5);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const token = localStorage.getItem('token');

  const handleMessageClick = async (message) => {
    setSelectedMessage(message);
    if (!message.isRead) {
      try {
        const response = await fetch(`http://localhost:5000/api/messages/${message._id}/read`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
        if (!response.ok) throw new Error('Mesaj okundu olarak işaretlenemedi');
        await response.json(); // Yanıtı kontrol et ama değişkene atama
        setMessages(messages.map((msg) => (msg._id === message._id ? {...msg, isRead: true} : msg)));
      } catch (error) {
        console.error('Mesaj okundu işaretleme hatası:', error);
      }
    }
  };

  const handleMessageDelete = async (id) => {
    if (!window.confirm('Bu mesajı silmek istediğinizden emin misiniz?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/messages/${id}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      if (!response.ok) throw new Error('Mesaj silinemedi');
      setMessages(messages.filter((msg) => msg._id !== id));
      setSelectedMessage(null);
      setSelectedMessages(selectedMessages.filter((msgId) => msgId !== id));
    } catch (error) {
      console.error('Mesaj silme hatası:', error);
      alert('Mesaj silinemedi.');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedMessages.length === 0) return alert('Lütfen silmek için mesaj seçin.');
    if (!window.confirm('Seçili mesajları silmek istediğinizden emin misiniz?')) return;
    try {
      const response = await fetch('http://localhost:5000/api/messages/bulk-delete', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ids: selectedMessages }),
      });
      if (!response.ok) throw new Error('Mesajlar silinemedi');
      setMessages(messages.filter((msg) => !selectedMessages.includes(msg._id)));
      setSelectedMessages([]);
      setSelectedMessage(null);
    } catch (error) {
      console.error('Toplu mesaj silme hatası:', error);
      alert('Mesajlar silinemedi.');
    }
  };

  const handleBulkRead = async () => {
    if (selectedMessages.length === 0) return alert('Lütfen okundu yapmak için mesaj seçin.');
    try {
      const response = await fetch('http://localhost:5000/api/messages/bulk-read', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ids: selectedMessages }),
      });
      if (!response.ok) throw new Error('Mesajlar okundu yapılamadı');
      setMessages(
        messages.map((msg) =>
          selectedMessages.includes(msg._id) ? { ...msg, isRead: true } : msg
        )
      );
      setSelectedMessages([]);
    } catch (error) {
      console.error('Toplu okundu işaretleme hatası:', error);
      alert('Mesajlar okundu yapılamadı.');
    }
  };

  const handleSelectAllMessages = (event) => {
    if (event.target.checked) {
      const visibleMessages = filteredMessages.slice(
        pageMessages * rowsPerPageMessages,
        pageMessages * rowsPerPageMessages + rowsPerPageMessages
      );
      setSelectedMessages(visibleMessages.map((msg) => msg._id));
    } else {
      setSelectedMessages([]);
    }
  };

  const handleSelectMessage = (id) => {
    setSelectedMessages((prev) =>
      prev.includes(id) ? prev.filter((msgId) => msgId !== id) : [...prev, id]
    );
  };

  const filteredMessages = messages.filter((msg) => {
    const matchesFilter =
      filter === 'all' || (filter === 'read' && msg.isRead) || (filter === 'unread' && !msg.isRead);
    const matchesSearch =
      (msg.fullName || '').toLowerCase().includes(searchTermMessages.toLowerCase()) ||
      (msg.email || '').toLowerCase().includes(searchTermMessages.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleChangePageMessages = (event, newPage) => {
    setPageMessages(newPage);
    setSelectedMessages([]);
  };

  const handleChangeRowsPerPageMessages = (event) => {
    setRowsPerPageMessages(parseInt(event.target.value, 10));
    setPageMessages(0);
    setSelectedMessages([]);
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>Mesajlar</Typography>
      <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          label="Ad veya E-posta ile Ara"
          value={searchTermMessages}
          onChange={(e) => setSearchTermMessages(e.target.value)}
          sx={{ minWidth: 200 }}
        />
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Filtrele</InputLabel>
          <Select value={filter} onChange={(e) => setFilter(e.target.value)} label="Filtrele">
            <MenuItem value="all">Tümü</MenuItem>
            <MenuItem value="read">Okundu</MenuItem>
            <MenuItem value="unread">Okunmadı</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="success"
          onClick={handleBulkRead}
          disabled={selectedMessages.length === 0}
        >
          Seçilenleri Okundu Yap
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleBulkDelete}
          disabled={selectedMessages.length === 0}
        >
          Seçilenleri Sil
        </Button>
      </Box>
      <Table className={styles.table}>
        <TableHead>
          <TableRow>
            <TableCell>
              <Checkbox
                checked={
                  filteredMessages.length > 0 &&
                  selectedMessages.length ===
                    filteredMessages.slice(
                      pageMessages * rowsPerPageMessages,
                      pageMessages * rowsPerPageMessages + rowsPerPageMessages
                    ).length &&
                  filteredMessages
                    .slice(
                      pageMessages * rowsPerPageMessages,
                      pageMessages * rowsPerPageMessages + rowsPerPageMessages
                    )
                    .every((msg) => selectedMessages.includes(msg._id))
                }
                onChange={handleSelectAllMessages}
              />
            </TableCell>
            <TableCell>Ad Soyad</TableCell>
            <TableCell>E-posta</TableCell>
            <TableCell>Telefon</TableCell>
            <TableCell>Tarih</TableCell>
            <TableCell>Durum</TableCell>
            <TableCell>İşlem</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredMessages
            .slice(
              pageMessages * rowsPerPageMessages,
              pageMessages * rowsPerPageMessages + rowsPerPageMessages
            )
            .map((msg) => (
              <TableRow key={msg._id}>
                <TableCell>
                  <Checkbox
                    checked={selectedMessages.includes(msg._id)}
                    onChange={() => handleSelectMessage(msg._id)}
                  />
                </TableCell>
                <TableCell>{msg.fullName || '-'}</TableCell>
                <TableCell>{msg.email || '-'}</TableCell>
                <TableCell>{msg.phone || '-'}</TableCell>
                <TableCell>
                  {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : '-'}
                </TableCell>
                <TableCell>
                  {msg.isRead ? (
                    <Typography color="success.main">Okundu</Typography>
                  ) : (
                    <Typography color="error.main">Okunmadı</Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleMessageClick(msg)}
                    sx={{ mr: 1 }}
                  >
                    Görüntüle
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleMessageDelete(msg._id)}
                  >
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
        count={filteredMessages.length}
        rowsPerPage={rowsPerPageMessages}
        page={pageMessages}
        onPageChange={handleChangePageMessages}
        onRowsPerPageChange={handleChangeRowsPerPageMessages}
      />

      <Dialog open={!!selectedMessage} onClose={() => setSelectedMessage(null)}>
        <DialogTitle>Mesaj Detayı</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            <strong>Ad Soyad:</strong> {selectedMessage?.fullName || '-'}
          </Typography>
          <Typography variant="body1">
            <strong>E-posta:</strong> {selectedMessage?.email || '-'}
          </Typography>
          <Typography variant="body1">
            <strong>Telefon:</strong> {selectedMessage?.phone || '-'}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            <strong>Mesaj:</strong>
            <br />
            {selectedMessage?.message || '-'}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            <strong>Gönderim Tarihi:</strong>{' '}
            {selectedMessage?.createdAt
              ? new Date(selectedMessage.createdAt).toLocaleString()
              : '-'}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            <strong>Durum:</strong>{' '}
            {selectedMessage?.isRead ? (
              <span style={{ color: 'green' }}>Okundu</span>
            ) : (
              <span style={{ color: 'red' }}>Okunmadı</span>
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedMessage(null)} color="primary">
            Kapat
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default MessagesSection;