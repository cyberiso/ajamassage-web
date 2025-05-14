// src/components/admin/BookingsSection.jsx
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
import { useTranslation } from 'react-i18next';
import styles from '../../styles/AdminDashboard.module.css';

function BookingsSection({ bookings, setBookings }) {
  const { t } = useTranslation();
  const [searchTermBookings, setSearchTermBookings] = useState('');
  const [pageBookings, setPageBookings] = useState(0);
  const [rowsPerPageBookings, setRowsPerPageBookings] = useState(5);
  const [pagePastBookings, setPagePastBookings] = useState(0);
  const [rowsPerPagePastBookings, setRowsPerPagePastBookings] = useState(5);
  const token = localStorage.getItem('token');

  const handleStatusChange = async (id, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Güncellendi
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error(t('status_update_failed'));
      const updatedBooking = await response.json();
      setBookings(bookings.map((b) => (b._id === id ? updatedBooking : b)));
    } catch (error) {
      console.error('Status update error:', error);
      alert(t('status_update_failed'));
    }
  };

  const currentDate = new Date();
  const currentBookings = bookings.filter(
    (booking) => new Date(booking.date) >= currentDate
  );
  const pastBookings = bookings.filter(
    (booking) => new Date(booking.date) < currentDate
  );

  const filteredCurrentBookings = currentBookings.filter(
    (booking) =>
      (booking.name || '').toLowerCase().includes(searchTermBookings.toLowerCase()) ||
      (booking.phone || '').toLowerCase().includes(searchTermBookings.toLowerCase())
  );

  const filteredPastBookings = pastBookings.filter(
    (booking) =>
      (booking.name || '').toLowerCase().includes(searchTermBookings.toLowerCase()) ||
      (booking.phone || '').toLowerCase().includes(searchTermBookings.toLowerCase())
  );

  const handleChangePageBookings = (event, newPage) => setPageBookings(newPage);
  const handleChangeRowsPerPageBookings = (event) => {
    setRowsPerPageBookings(parseInt(event.target.value, 10));
    setPageBookings(0);
  };

  const handleChangePagePastBookings = (event, newPage) => setPagePastBookings(newPage);
  const handleChangeRowsPerPagePastBookings = (event) => {
    setRowsPerPagePastBookings(parseInt(event.target.value, 10));
    setPagePastBookings(0);
  };

  const renderTable = (data, page, rowsPerPage, handlePageChange, handleRowsPerPageChange) => (
    <Box>
      <Table className={styles.table}>
        <TableHead>
          <TableRow>
            <TableCell>{t('name')}</TableCell>
            <TableCell>{t('customer_phone')}</TableCell>
            <TableCell>{t('service')}</TableCell>
            <TableCell>{t('date')}</TableCell>
            <TableCell>{t('status')}</TableCell>
            <TableCell>{t('note')}</TableCell>
            <TableCell>{t('cancel_code')}</TableCell>
            <TableCell>{t('actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((booking) => (
              <TableRow key={booking._id}>
                <TableCell>{booking.name || '-'}</TableCell>
                <TableCell>{booking.phone || '-'}</TableCell>
                <TableCell>{booking.service || '-'}</TableCell>
                <TableCell>{booking.date ? new Date(booking.date).toLocaleString() : '-'}</TableCell>
                <TableCell>{booking.status || '-'}</TableCell>
                <TableCell>{booking.note || '-'}</TableCell>
                <TableCell>{booking.cancelToken || '-'}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => handleStatusChange(booking._id, t('approved'))}
                    disabled={booking.status === t('approved')}
                    sx={{ mr: 1 }}
                  >
                    {booking.status === t('approved') ? t('approved') : t('approve')}
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleStatusChange(booking._id, t('cancelled'))}
                    disabled={booking.status === t('cancelled')}
                  >
                    {t('cancel')}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        labelRowsPerPage={t('rows_per_page')}
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} / ${count}`}
      />
    </Box>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>{t('appointments')}</Typography>
      <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          label={t('search_by_name_or_phone')}
          value={searchTermBookings}
          onChange={(e) => setSearchTermBookings(e.target.value)}
          sx={{ minWidth: 200 }}
        />
      </Box>
      {filteredCurrentBookings.length > 0 ? (
        renderTable(
          filteredCurrentBookings,
          pageBookings,
          rowsPerPageBookings,
          handleChangePageBookings,
          handleChangeRowsPerPageBookings
        )
      ) : (
        <Typography>{t('no_current_appointments')}</Typography>
      )}

      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>{t('past_appointments')}</Typography>
      {filteredPastBookings.length > 0 ? (
        renderTable(
          filteredPastBookings,
          pagePastBookings,
          rowsPerPagePastBookings,
          handleChangePagePastBookings,
          handleChangeRowsPerPagePastBookings
        )
      ) : (
        <Typography>{t('no_past_appointments')}</Typography>
      )}
    </Box>
  );
}

export default BookingsSection;
