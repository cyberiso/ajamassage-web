// src/components/BookingForm.jsx
import { useState, useEffect, useCallback } from 'react';
import { Box, TextField, Button, Typography, MenuItem, CircularProgress } from '@mui/material'; // CircularProgress eklendi
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios'; // axios eklendi
import { useTranslation } from 'react-i18next';
import styles from './BookingForm.module.css';

// Sabitler
const START_HOUR = 14;
const END_HOUR = 21; // Bitiş saati (dahil)
const TIME_SLOTS = Array.from({ length: (END_HOUR - START_HOUR) + 1 }, (_, i) => { // +1 -> Bitiş saati dahil
  const hour = START_HOUR + i; // Her saat başı
  const minute = 0; // Dakika her zaman 0
  return { hour, minute };
});

function BookingForm({ onClose }) {
  const { t, i18n } = useTranslation(); // i18n eklendi
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    date: '', 
    service: '', 
    note: '' 
  });
  const [bookedDates, setBookedDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  // const services = ['Klasik Masaj', 'Spor Masajı', 'Aromaterapi']; // Statik liste kaldırıldı
  const [fetchedServices, setFetchedServices] = useState([]); // Dinamik hizmet listesi için state
  const [servicesLoading, setServicesLoading] = useState(true); // Hizmet yükleme durumu
  const [servicesError, setServicesError] = useState(null); // Hizmet yükleme hatası
  const [isBookingEnabled, setIsBookingEnabled] = useState(true);

  useEffect(() => {
    // Hizmetleri çek
    const fetchServices = async () => {
      try {
        setServicesLoading(true);
        const response = await axios.get('/api/services'); // Proxy ayarı sayesinde tam URL gerekmez
        setFetchedServices(response.data || []);
        setServicesError(null);
      } catch (err) {
        console.error('Error fetching services:', err);
        setServicesError(t('fetch_services_error'));
        setFetchedServices([]);
      } finally {
        setServicesLoading(false);
      }
    };

    fetchServices();

    // Mevcut booked dates fetch işlemi
    fetch('http://localhost:5000/api/bookings/available')
      .then((res) => res.json())
      .then((data) => setBookedDates(data.map((d) => new Date(d))))
      .catch((err) => console.error('Error fetching booked dates:', err));
  }, []); // t'yi bağımlılıklara ekleyebiliriz ama hata mesajı için gerekli değilse kaldırılabilir.

  useEffect(() => {
    if (selectedDate) {
      const dayStart = new Date(selectedDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(selectedDate);
      dayEnd.setHours(23, 59, 59, 999);

      // Tüm slotları oluştur
      const allSlots = TIME_SLOTS.map(({ hour, minute }) => {
        const date = new Date(selectedDate);
        date.setHours(hour, minute, 0, 0);
        return date;
      });

      // Rezerve edilmiş slotları filtrele
      const bookedSlots = bookedDates
        .filter(date => date >= dayStart && date <= dayEnd)
        .map(date => date.getTime());

      const freeSlots = allSlots.filter(
        slot => !bookedSlots.includes(slot.getTime())
      );

      setAvailableSlots(freeSlots);
    }
  }, [selectedDate, bookedDates]);

  useEffect(() => {
    checkBookingStatus();
  }, []);

  const checkBookingStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/settings');
      const data = await response.json();
      setIsBookingEnabled(data.isBookingEnabled);
    } catch (err) {
      console.error('Randevu sistemi durumu kontrol edilemedi:', err);
    }
  };

  const handleDateChange = useCallback((date) => {
    setSelectedDate(date);
    setFormData((prev) => ({ ...prev, date: '' }));
  }, []);

  const handleSlotSelect = useCallback((slot) => {
    const localISOTime = new Date(slot.getTime() - slot.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    setFormData((prev) => ({ ...prev, date: localISOTime }));
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.date) {
      alert(t('please_select_hour'));
      return;
    }
    if (!formData.phone) {
      alert(t('please_enter_phone'));
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const newBooking = await response.json();
        alert(`${t('booking_success')}\n${t('cancel_code')}: ${newBooking.cancelToken}`);
        setFormData({ name: '', email: '', phone: '', date: '', service: '', note: '' });
        setSelectedDate(null);
        setBookedDates((prev) => [...prev, new Date(newBooking.date)]);
        onClose();
      } else {
        const errorData = await response.json();
        alert(`${t('error')}: ${errorData.message || t('something_wrong')}`);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert(t('server_unreachable'));
    }
  };

  const tileDisabled = useCallback(({ date }) => {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const bookedSlots = bookedDates.filter(
      d => d >= dayStart && d <= dayEnd
    ).length;
    
    return bookedSlots >= TIME_SLOTS.length;
  }, [bookedDates]);

  if (!isBookingEnabled) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error" gutterBottom>
          {t('booking_system_disabled')}
        </Typography>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{ mt: 2 }}
        >
          {t('close')}
        </Button>
      </Box>
    );
  }

  return (
    <Box className={styles.container}>
      <Typography variant="h4" gutterBottom>{t('book_appointment')}</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label={t('name')}
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label={t('email')}
          name="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label={t('phone_number')}
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="tel"
          placeholder={t('phone_placeholder')}
        />
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">{t('select_date')}</Typography>
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            tileDisabled={tileDisabled}
            minDate={new Date()}
          />
        </Box>

        {selectedDate && availableSlots.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">{t('available_hours')}</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {availableSlots.map((slot) => (
                <Button
                  key={slot.toISOString()}
                  className={styles.hourButton}
                  variant={
                    formData.date && 
                    new Date(formData.date).getTime() === slot.getTime()
                      ? 'contained'
                      : 'outlined'
                  }
                  onClick={() => handleSlotSelect(slot)}
                >
                  {slot.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: false 
                  })}
                </Button>
              ))}
            </Box>
          </Box>
        )}

        {selectedDate && availableSlots.length === 0 && (
          <Typography color="error" sx={{ mt: 2 }}>
            {t('no_hours_available')}
          </Typography>
        )}

        <TextField
          select
          label={t('select_service')}
          name="service"
          value={formData.service}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled={servicesLoading || !!servicesError} // Yüklenirken veya hata varsa devre dışı bırak
        >
          {servicesLoading && <MenuItem value=""><CircularProgress size={20} /></MenuItem>}
          {servicesError && <MenuItem value="" disabled>{servicesError}</MenuItem>}
          {!servicesLoading && !servicesError && fetchedServices.length === 0 && (
            <MenuItem value="" disabled>{t('no_services')}</MenuItem>
          )}
          {!servicesLoading && !servicesError && fetchedServices.map((service) => (
            <MenuItem key={service._id} value={service.name.tr}> {/* Değer olarak Türkçe ismi saklayalım */}
              {/* Aktif dile göre ismi göster */}
              {service.name[i18n.language.split('-')[0]] || service.name.tr} 
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label={t('note_optional')}
          name="note"
          value={formData.note}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={3}
        />

        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          fullWidth 
          sx={{ mt: 2 }}
        >
          {t('request_appointment')}
        </Button>
      </form>
    </Box>
  );
}

export default BookingForm;
