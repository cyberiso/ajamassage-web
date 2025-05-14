// src/components/admin/DashboardSection.jsx
import React from 'react';
import { Box, Card, CardContent, Grid, Typography, Paper, Divider, List, ListItem, ListItemText, ListItemIcon, Avatar, Button, IconButton } from '@mui/material';
import { People, Message, Event, Star, TrendingUp, Notifications, CalendarToday, AccessTime, MoreVert, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import useAdminData from '../../hooks/useAdminData';
import { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { format, parseISO, subDays, differenceInDays } from 'date-fns';
import { tr } from 'date-fns/locale';

// Chart.js bileşenlerini kaydet
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function DashboardSection() {
  const {
    bookings,
    messages,
    reviews,
    services,
    treatments,
    setMessages
  } = useAdminData(); // Verileri hook'tan alıyoruz

  const [recentBookings, setRecentBookings] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState({ labels: [], bookings: [], messages: [] });
  const [serviceDistribution, setServiceDistribution] = useState({ labels: [], data: [] });

  // İstatistik verileri (örnek olarak hook'tan gelen verileri kullanıyoruz)
  const stats = [
    {
      title: 'Toplam Randevu',
      value: bookings?.length || 0,
      icon: <Event fontSize="large" sx={{ color: '#4CAF50' }} />,
      change: '+12%',
      trend: 'up',
    },
    {
      title: 'Mesaj Sayısı',
      value: messages?.length || 0,
      icon: <Message fontSize="large" sx={{ color: '#2196F3' }} />,
      change: '+5%',
      trend: 'up',
    },
    {
      title: 'Müşteri Yorumları',
      value: reviews?.length || 0,
      icon: <Star fontSize="large" sx={{ color: '#FFC107' }} />,
      change: '+8%',
      trend: 'up',
    },
    {
      title: 'Hizmet Sayısı',
      value: services?.length + (treatments?.length || 0),
      icon: <People fontSize="large" sx={{ color: '#9C27B0' }} />,
      change: '0%',
      trend: 'neutral',
    },
  ];
  
  // Mesajı okundu olarak işaretle
  const handleMarkAsRead = async (messageId) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/messages/${messageId}/read`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      
      if (!response.ok) {
        throw new Error('Mesaj okundu olarak işaretlenemedi');
      }
      
      await response.json(); // Yanıtı kontrol et ama değişkene atama
      
      // Mesajları güncelle
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg._id === messageId ? { ...msg, isRead: true } : msg
        )
      );
      
      // Son mesajlar listesini güncelle
      setRecentMessages(prevMessages => 
        prevMessages.map(msg => 
          msg._id === messageId ? { ...msg, isRead: true } : msg
        )
      );
      
    } catch (error) {
      console.error('Mesaj okundu işaretleme hatası:', error);
    }
  };
  
  // Son randevuları ve mesajları hazırla
  useEffect(() => {
    if (bookings && bookings.length > 0) {
      // Son 5 randevuyu al ve tarihe göre sırala
      const sortedBookings = [...bookings].sort((a, b) => 
        new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)
      ).slice(0, 5);
      setRecentBookings(sortedBookings);
    }
    
    if (messages && messages.length > 0) {
      // Son 5 mesajı al ve tarihe göre sırala
      const sortedMessages = [...messages].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      ).slice(0, 5);
      setRecentMessages(sortedMessages);
    }
    
    // Aylık istatistikleri hazırla
    if (bookings && messages) {
      // Son 6 ay için etiketleri oluştur
      const today = new Date();
      const labels = Array.from({ length: 6 }, (_, i) => {
        const date = subDays(today, i * 30);
        return format(date, 'MMM', { locale: tr });
      }).reverse();
      
      // Son 6 ay için randevu sayılarını hesapla
      const bookingData = labels.map((_, index) => {
        const startDate = subDays(today, (index + 1) * 30);
        const endDate = subDays(today, index * 30);
        
        return bookings.filter(booking => {
          const bookingDate = new Date(booking.date || booking.createdAt);
          return bookingDate >= startDate && bookingDate <= endDate;
        }).length;
      });
      
      // Son 6 ay için mesaj sayılarını hesapla
      const messageData = labels.map((_, index) => {
        const startDate = subDays(today, (index + 1) * 30);
        const endDate = subDays(today, index * 30);
        
        return messages.filter(message => {
          const messageDate = new Date(message.createdAt);
          return messageDate >= startDate && messageDate <= endDate;
        }).length;
      });
      
      setMonthlyStats({
        labels,
        bookings: bookingData,
        messages: messageData
      });
    }
    
    // Hizmet dağılımını hazırla
    if (services && services.length > 0) {
      // Hizmet isimlerini doğru şekilde al
      // Çoklu dil desteği için name.tr, name.en veya name.de kullan
      const serviceLabels = services.map(service => {
        // Öncelikle name nesnesini kontrol et
        if (service.name && typeof service.name === 'object') {
          // Tercih sırası: Türkçe, İngilizce, Almanca
          return service.name.tr || service.name.en || service.name.de || 'Hizmet';
        }
        // Eğer title varsa onu kullan
        else if (service.title) {
          return service.title;
        }
        // Hiçbiri yoksa varsayılan değer döndür
        return 'Hizmet ' + (services.indexOf(service) + 1);
      }).slice(0, 5);
      
      // Örnek veri - gerçek veride randevuları hizmetlere göre gruplandırabilirsiniz
      const serviceData = services.map(() => Math.floor(Math.random() * 30) + 5).slice(0, 5);
      
      setServiceDistribution({
        labels: serviceLabels,
        data: serviceData
      });
    }
  }, [bookings, messages, services, treatments]);

  // Grafik verileri
  const lineChartData = {
    labels: monthlyStats.labels,
    datasets: [
      {
        label: 'Randevular',
        data: monthlyStats.bookings,
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        tension: 0.4,
      },
      {
        label: 'Mesajlar',
        data: monthlyStats.messages,
        borderColor: '#2196F3',
        backgroundColor: 'rgba(33, 150, 243, 0.2)',
        tension: 0.4,
      },
    ],
  };
  
  const pieChartData = {
    labels: serviceDistribution.labels,
    datasets: [
      {
        data: serviceDistribution.data,
        backgroundColor: [
          '#4CAF50',
          '#2196F3',
          '#FFC107',
          '#9C27B0',
          '#F44336',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Aylık Aktivite',
      },
    },
  };
  
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Hizmet Dağılımı',
      },
    },
  };

  // Tarihi formatla
  const formatDate = (dateString) => {
    if (!dateString) return 'Tarih yok';
    try {
      return format(parseISO(dateString), 'dd MMMM yyyy', { locale: tr });
    } catch {
      return 'Geçersiz tarih';
    }
  };

  // Zaman farkını formatla
  const getTimeAgo = (dateString) => {
    if (!dateString) return '';
    try {
      const date = parseISO(dateString);
      const days = differenceInDays(new Date(), date);
      
      if (days === 0) return 'Bugün';
      if (days === 1) return 'Dün';
      return `${days} gün önce`;
    } catch {
      return '';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom align='center' sx={{ fontWeight: 'bold', color: '#1976d2', mb: 3 }}>
        Dashboard
      </Typography>
      
      {/* İstatistik Kartları - Modern Tasarım */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper elevation={3} sx={{ 
              p: 2, 
              borderRadius: 2, 
              height: '100%',
              background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 6
              }
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                  p: 1.5, 
                  borderRadius: '50%', 
                  display: 'flex',
                  bgcolor: 'rgba(0, 0, 0, 0.04)'
                }}>
                  {stat.icon}
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  color: stat.trend === 'up' ? 'success.main' : stat.trend === 'down' ? 'error.main' : 'text.secondary',
                  fontSize: '0.875rem'
                }}>
                  {stat.trend === 'up' && <ArrowUpward fontSize="small" />}
                  {stat.trend === 'down' && <ArrowDownward fontSize="small" />}
                  <Typography variant="body2" sx={{ ml: 0.5 }}>{stat.change}</Typography>
                </Box>
              </Box>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {stat.value}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                {stat.title}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      
      {/* Grafikler Bölümü */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: 350 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
              <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} />
              Aktivite Analizi
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ height: 270 }}>
              <Line data={lineChartData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: 350 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
              <People sx={{ mr: 1, verticalAlign: 'middle' }} />
              Hizmet Dağılımı
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ height: 270, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Pie data={pieChartData} options={pieChartOptions} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Son Aktiviteler Bölümü */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                <Event sx={{ mr: 1, verticalAlign: 'middle' }} />
                Son Randevular
              </Typography>
              <Button size="small" endIcon={<MoreVert />} sx={{ textTransform: 'none' }}>
                Tümünü Gör
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List sx={{ width: '100%' }}>
              {recentBookings.length > 0 ? (
                recentBookings.map((booking, index) => (
                  <React.Fragment key={booking._id || index}>
                    <ListItem alignItems="flex-start" sx={{ px: 1 }}>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: '#4CAF50' }}>
                          <CalendarToday />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                            {booking.name || 'İsimsiz Müşteri'}
                          </Typography>
                        }
                        secondary={
                          <React.Fragment>
                            <Typography variant="body2" component="span" color="text.primary">
                              {booking.service || 'Belirtilmemiş Hizmet'}
                            </Typography>
                            <Box component="div" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                              {formatDate(booking.date || booking.createdAt)}
                              <Typography variant="caption" component="span" sx={{ ml: 1, color: 'text.disabled', display: 'inline-block' }}>
                                {getTimeAgo(booking.date || booking.createdAt)}
                              </Typography>
                            </Box>
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    {index < recentBookings.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="Henüz randevu bulunmuyor" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                <Notifications sx={{ mr: 1, verticalAlign: 'middle' }} />
                Son Mesajlar
              </Typography>
              <Button size="small" endIcon={<MoreVert />} sx={{ textTransform: 'none' }}>
                Tümünü Gör
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List sx={{ width: '100%' }}>
              {recentMessages.length > 0 ? (
                recentMessages.map((message, index) => (
                  <React.Fragment key={message._id || index}>
                    <ListItem alignItems="flex-start" sx={{ px: 1 }}>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: message.isRead ? '#9e9e9e' : '#2196F3' }}>
                          <Message />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                              {message.fullName || 'İsimsiz'}
                            </Typography>
                            {!message.isRead && (
                              <Button 
                                size="small" 
                                variant="outlined" 
                                color="primary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkAsRead(message._id);
                                }}
                                sx={{ minWidth: '80px', height: '24px', fontSize: '0.7rem', py: 0 }}
                              >
                                Okundu Yap
                              </Button>
                            )}
                            {message.isRead && (
                              <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 'medium' }}>
                                Okundu
                              </Typography>
                            )}
                          </Box>
                        }
                        secondary={
                          <React.Fragment>
                            <Typography variant="body2" component="span" color="text.primary" sx={{ 
                              display: 'inline-block',
                              maxWidth: '100%',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {message.message?.substring(0, 50) + (message.message?.length > 50 ? '...' : '') || 'Mesaj içeriği yok'}
                            </Typography>
                            <Box component="div" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                              {formatDate(message.createdAt)}
                              <Typography variant="caption" component="span" sx={{ ml: 1, color: 'text.disabled', display: 'inline-block' }}>
                                {getTimeAgo(message.createdAt)}
                              </Typography>
                            </Box>
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    {index < recentMessages.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="Henüz mesaj bulunmuyor" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DashboardSection;