// src/components/ScrollToTop.jsx
import { useState, useEffect } from 'react';
import { Fab } from '@mui/material';
import { ArrowUpward } from '@mui/icons-material';

function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Sayfanın kaydırma pozisyonunu izle
  const toggleVisibility = () => {
    if (window.scrollY > 100) { // 300px kaydırıldığında görünür
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Sayfa başına kaydır
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Yumuşak kaydırma
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility); // Temizlik
  }, []);

  return (
    <>
      {isVisible && (
        <Fab
          color="primary"
          aria-label="sayfa başı"
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 1000, // Diğer öğelerin üstünde kalması için
          }}
        >
          <ArrowUpward />
        </Fab>
      )}
    </>
  );
}

export default ScrollToTop;