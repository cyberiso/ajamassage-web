import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const BookingDialog = ({ open, onClose }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      scroll="paper"
      sx={{
        '& .MuiDialog-paper': {
          margin: { xs: '0', sm: '16px', md: '24px' },
          width: { xs: '100%', sm: 'calc(100% - 32px)', md: 'auto' },
          maxHeight: { xs: '100%', sm: 'calc(100vh - 32px)', md: '90vh' },
          borderRadius: { xs: '0', sm: '8px' },
          overflow: 'auto',
          height: { xs: '100%', sm: 'auto' }
        },
      }}
    >
      <DialogTitle sx={{ 
        padding: { xs: '12px 16px', sm: '16px 20px' },
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        '& .MuiTypography-root': {
          fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
        }
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{t('book_appointment')}</Typography>
          <IconButton 
            onClick={onClose} 
            size="small"
            sx={{ 
              color: 'text.secondary',
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
            }}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent 
        dividers
        sx={{ 
          padding: { xs: '10px', sm: '16px', md: '20px' },
          '&.MuiDialogContent-root': {
            paddingTop: '12px'
          },
          overflowY: 'auto',
          maxHeight: { xs: 'calc(100vh - 120px)', sm: 'calc(100vh - 160px)', md: 'calc(100vh - 200px)' }
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: { xs: 1.5, sm: 2, md: 3 },
          minHeight: '150px',
          width: '100%',
          overflow: 'visible'
        }}>
          {/* Rest of the component content */}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog; 