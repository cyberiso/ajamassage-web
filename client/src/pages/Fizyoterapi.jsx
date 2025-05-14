import { useState, useEffect } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import ServiceCard from '../components/ServiceCard';

function Fizyoterapi() {
  const [treatments, setTreatments] = useState([]);

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
    <Box sx={{ p: 4, maxWidth: '1200px', mx: 'auto' }}>
      <Typography variant="h4" gutterBottom align="center">
        Fizyoterapi Hizmetlerimiz
      </Typography>
      <Grid container spacing={3}>
        {treatments.map((treatment) => (
          <Grid item xs={12} sm={6} md={4} key={treatment._id}>
            <ServiceCard service={treatment} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Fizyoterapi;