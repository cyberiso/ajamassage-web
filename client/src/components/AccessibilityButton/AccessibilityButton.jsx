import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { Accessibility, TextIncrease, TextDecrease, Contrast, VolumeUp } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const AccessibilityButton = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { t } = useTranslation();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFontSize = (increase) => {
    const html = document.documentElement;
    const currentSize = parseFloat(getComputedStyle(html).fontSize);
    const newSize = increase ? currentSize + 2 : currentSize - 2;
    html.style.fontSize = `${newSize}px`;
  };

  const handleHighContrast = () => {
    document.body.classList.toggle('high-contrast');
  };

  const handleScreenReader = () => {
    // Ekran okuyucu için metin okuma özelliği
    const text = document.body.innerText;
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <>
      <Tooltip title={t('accessibility_options')}>
        <IconButton
          onClick={handleClick}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            backgroundColor: 'primary.main',
            color: 'white',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          }}
        >
          <Accessibility />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => { handleFontSize(true); handleClose(); }}>
          <TextIncrease sx={{ mr: 1 }} />
          {t('increase_font_size')}
        </MenuItem>
        <MenuItem onClick={() => { handleFontSize(false); handleClose(); }}>
          <TextDecrease sx={{ mr: 1 }} />
          {t('decrease_font_size')}
        </MenuItem>
        <MenuItem onClick={() => { handleHighContrast(); handleClose(); }}>
          <Contrast sx={{ mr: 1 }} />
          {t('high_contrast')}
        </MenuItem>
        <MenuItem onClick={() => { handleScreenReader(); handleClose(); }}>
          <VolumeUp sx={{ mr: 1 }} />
          {t('screen_reader')}
        </MenuItem>
      </Menu>
    </>
  );
};

export default AccessibilityButton; 