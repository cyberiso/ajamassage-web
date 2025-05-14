// src/pages/Physiotherapy.jsx
import { useState, useEffect } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import ServiceCard from '../components/ServiceCard';
import StatsSection from '../components/StatsSection';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

function Physiotherapy() {
  const [treatments, setTreatments] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // 600px altı mobil

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/treatments');
        if (!response.ok) throw new Error('Fizyoterapi hizmetleri çekilemedi');
        const data = await response.json();
        setTreatments(data);
      } catch (error) {
        console.error('Fizyoterapi hizmetleri çekme hatası:', error);
      }
    };

    fetchTreatments();
  }, []);

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 }, // Mobilde 16px, büyük ekranlarda 32px
        maxWidth: '1200px',
        mx: 'auto',
      }}
    >
      <Typography
        variant={isMobile ? 'h5' : 'h4'} // Mobilde h5, büyük ekranlarda h4
        gutterBottom
        align="center"
      >
        Fizyoterapi Hizmetlerimiz
      </Typography>
      <Grid container spacing={isMobile ? 2 : 3}> {/* Mobilde spacing 2 */}
        {treatments.map((treatment) => (
          <Grid item xs={12} sm={6} md={4} key={treatment._id}>
            <ServiceCard service={treatment} />
          </Grid>
        ))}
      </Grid>
      <StatsSection />
    </Box>
  );
}

export default Physiotherapy;