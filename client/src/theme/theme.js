import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#805ad5',
      light: '#9f7aea',
      dark: '#6b46c1',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#d69e2e',
      light: '#f6e05e',
      dark: '#b7791f',
      contrastText: '#000000',
    },
    background: {
      default: '#ffffff',
      paper: '#f7fafc',
    },
    text: {
      primary: '#2d3748',
      secondary: '#4a5568',
    },
    divider: '#e2e8f0',
    icon: {
      primary: '#805ad5',
      secondary: '#9f7aea',
      hover: '#6b46c1',
    },
    custom: {
      lightPurple: '#f3e8ff',
      mediumPurple: '#9f7aea',
      darkPurple: '#6b46c1',
      veryLightPurple: '#faf5ff',
      accent: '#d69e2e',
    }
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: '2.5rem',
      color: '#805ad5',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      color: '#805ad5',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      color: '#805ad5',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      color: '#805ad5',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      color: '#805ad5',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      color: '#805ad5',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
    subtitle1: {
      color: '#805ad5',
    },
    subtitle2: {
      color: '#9f7aea',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 4px rgba(128, 90, 213, 0.2)',
          },
        },
        outlined: {
          borderColor: '#805ad5',
          color: '#805ad5',
          '&:hover': {
            borderColor: '#6b46c1',
            backgroundColor: 'rgba(128, 90, 213, 0.04)',
          },
        },
        text: {
          color: '#805ad5',
          '&:hover': {
            backgroundColor: 'rgba(128, 90, 213, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 4px rgba(128, 90, 213, 0.1)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(128, 90, 213, 0.15)',
          },
        },
      },
    },
    MuiIcon: {
      styleOverrides: {
        root: {
          color: '#805ad5',
          '&:hover': {
            color: '#6b46c1',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#805ad5',
          '&:hover': {
            backgroundColor: 'rgba(128, 90, 213, 0.04)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#805ad5',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#9f7aea',
        },
      },
    },
  },
});

export default theme; 