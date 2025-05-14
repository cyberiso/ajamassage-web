// src/components/admin/CustomerReviewsSection.jsx
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
  TablePagination,
} from '@mui/material';
import styles from '../../styles/AdminDashboard.module.css';

function CustomerReviewsSection({ reviews, setReviews }) {
  const [searchTermReviews, setSearchTermReviews] = useState('');
  const [pageReviews, setPageReviews] = useState(0);
  const [rowsPerPageReviews, setRowsPerPageReviews] = useState(5);
  const token = localStorage.getItem('token');

  // Yorum durumunu güncelleme (Onaylama veya Reddetme)
  const handleStatusChange = async (id, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/reviews/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Durum güncellenemedi');
      const updatedReview = await response.json();
      setReviews(reviews.map((r) => (r._id === id ? updatedReview : r)));
    } catch (error) {
      console.error('Durum güncelleme hatası:', error);
      alert('Durum güncellenemedi.');
    }
  };

  // Yorum silme
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/reviews/${id}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token,
        },
      });
      if (!response.ok) throw new Error('Yorum silinemedi');
      setReviews(reviews.filter((r) => r._id !== id));
    } catch (error) {
      console.error('Silme hatası:', error);
      alert('Yorum silinemedi.');
    }
  };

  const filteredReviews = reviews.filter((review) =>
    (review.comment || '').toLowerCase().includes(searchTermReviews.toLowerCase()) ||
    (review.rating || '').toString().includes(searchTermReviews)
  );

  const handleChangePageReviews = (event, newPage) => setPageReviews(newPage);
  const handleChangeRowsPerPageReviews = (event) => {
    setRowsPerPageReviews(parseInt(event.target.value, 10));
    setPageReviews(0);
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>Müşteri Yorumları</Typography>
      <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          label="Yorum veya Puan ile Ara"
          value={searchTermReviews}
          onChange={(e) => setSearchTermReviews(e.target.value)}
          sx={{ minWidth: 200 }}
        />
      </Box>
      <Table className={styles.table}>
        <TableHead>
          <TableRow>
            <TableCell>Yorum</TableCell>
            <TableCell>Puan</TableCell>
            <TableCell>Tarih</TableCell>
            <TableCell>Durum</TableCell>
            <TableCell>İşlem</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredReviews
            .slice(pageReviews * rowsPerPageReviews, pageReviews * rowsPerPageReviews + rowsPerPageReviews)
            .map((review) => (
              <TableRow key={review._id}>
                <TableCell>{review.comment || '-'}</TableCell>
                <TableCell>{review.rating || '-'}</TableCell>
                <TableCell>{review.createdAt ? new Date(review.createdAt).toLocaleString() : '-'}</TableCell>
                <TableCell>{review.status || 'Beklemede'}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => handleStatusChange(review._id, 'Onaylandı')}
                    disabled={review.status === 'Onaylandı'}
                    sx={{ mr: 1 }}
                  >
                    {review.status === 'Onaylandı' ? 'Onaylandı' : 'Onayla'}
                  </Button>
                  <Button
                    variant="contained"
                    color="warning"
                    size="small"
                    onClick={() => handleStatusChange(review._id, 'Reddedildi')}
                    disabled={review.status === 'Reddedildi'}
                    sx={{ mr: 1 }}
                  >
                    Reddet
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(review._id)}
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
        count={filteredReviews.length}
        rowsPerPage={rowsPerPageReviews}
        page={pageReviews}
        onPageChange={handleChangePageReviews}
        onRowsPerPageChange={handleChangeRowsPerPageReviews}
      />
    </>
  );
}

export default CustomerReviewsSection;