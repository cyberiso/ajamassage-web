// src/pages/Home.jsx
import { useState, useEffect } from "react";
import { Box, Typography, Button, Grid } from "@mui/material";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import styles from "./Home.module.css";
import ServiceCard from "../components/ServiceCard";
//import TreatmentCard from "../components/TreatmentCard";
import ContactSection from "../components/ContactSection";
import GallerySection from "../components/GallerySection";
import AboutSection from "../components/AboutSection";
import StatsSection from "../components/StatsSection";

function Home() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // 600px altı mobil
  const [sliders, setSliders] = useState([]);
  const [services, setServices] = useState([]);
  //const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const slidersRes = await fetch("http://localhost:5000/api/sliders");
        if (!slidersRes.ok) throw new Error("Sliders çekilemedi");
        const slidersData = await slidersRes.json();
        setSliders(slidersData);

        const servicesRes = await fetch("http://localhost:5000/api/services");
        if (!servicesRes.ok) throw new Error(t('fetch_services_error'));
        const servicesData = await servicesRes.json();
        setServices(Array.isArray(servicesData) ? servicesData : []);

       // const treatmentsRes = await fetch("http://localhost:5000/api/treatments");
       // if (!treatmentsRes.ok) throw new Error(t('fetch_treatments_error'));
       // const treatmentsData = await treatmentsRes.json();
       // setTreatments(Array.isArray(treatmentsData) ? treatmentsData : []);

        setLoading(false);
      } catch (err) {
        console.error("Veri çekme hatası:", err);
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [t]);

  if (loading) return <Typography>{t('loading')}</Typography>;
  if (error) return <Typography>{t('error', { message: error })}</Typography>;

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: !isMobile, // Mobilde oklar gizlenir
    fade: true,
    pauseOnHover: true,
  };

  const currentLanguage = i18n.language.split('-')[0];

  return (
    <Box sx={{ pt: { xs: 1.5, sm: 1 } }}> {/* Header için boşluk */}
      {/* Slider Bölümü */}
      <Slider {...settings}>
        {sliders.map((slide) => (
          <Box key={slide._id} className={styles.slide}>
            <img
              src={`http://localhost:5000${slide.imageUrl}`}
              alt={slide.title}
              className={styles.slideImage}
            />
            <Box className={styles.slideContent}>
              <Typography variant={isMobile ? "h5" : "h3"} className={styles.slideTitle}>
                {slide.title}
              </Typography>
              <Typography variant={isMobile ? "body2" : "body1"} className={styles.slideDescription}>
                {slide.description}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/services"
                className={styles.slideButton}
                size={isMobile ? "small" : "medium"}
              >
                {t("explore_services")}
              </Button>
            </Box>
          </Box>
        ))}
      </Slider>

      {/* Hakkımızda Section */}
      <AboutSection />

      {/* Hizmetlerimiz Section */}
      <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: "1200px", mx: "auto" }}>
        <Typography variant={isMobile ? "h5" : "h4"} gutterBottom align="center">
          {t("services")}
        </Typography>
        <Grid container spacing={isMobile ? 2 : 3}>
          {services.slice(0, 6).map((service) => {
            const serviceName = service?.name?.[currentLanguage] || 'Unnamed Service';
            const serviceDescription = service?.description?.[currentLanguage] || '';
            return (
              <Grid item xs={12} sm={6} md={4} key={service._id}>
                <ServiceCard
                  service={{
                    ...service,
                    name: serviceName,
                    description: serviceDescription,
                  }}
                />
              </Grid>
            );
          })}
        </Grid>
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/services"
            size={isMobile ? "small" : "medium"}
          >
            {t("view_all_services")}
          </Button>
        </Box>
      </Box>

     {/* Fizyoterapi Section */}

          {/* 
           
      <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: "1200px", mx: "auto" }}>
        <Typography variant={isMobile ? "h5" : "h4"} gutterBottom align="center">
          {t("physiotherapy_services")}
        </Typography>
        <Grid container spacing={isMobile ? 2 : 3}>
          {treatments.slice(0, 6).map((treatment) => {
            const treatmentName = treatment?.name?.[currentLanguage] || 'Unnamed Treatment';
            const treatmentDescription = treatment?.description?.[currentLanguage] || '';
            return (
              <Grid item xs={12} sm={6} md={4} key={treatment._id}>
                <TreatmentCard
                  treatment={{
                    ...treatment,
                    name: treatmentName,
                    description: treatmentDescription,
                  }}
                />
              </Grid>
            );
          })}
        </Grid>
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/physiotherapy"
            size={isMobile ? "small" : "medium"}
          >
            {t("view_all_treatments")}
          </Button>
        </Box>
      </Box>
          
          
          */}

      {/* Galeri, İstatistik ve İletişim Section */}
      <GallerySection />
      <StatsSection />
      <ContactSection />
    </Box>
  );
}

export default Home;