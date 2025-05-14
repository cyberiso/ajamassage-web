# API Configuration Guide

## Overview

This document explains how the API configuration works in the AJA Massage website. The configuration has been designed to be dynamic and environment-aware, making it easy to deploy to different environments including the VPS server.

## Environment Files

The application uses environment variables to configure the API endpoints:

- `.env` - Used for local development
  ```
  VITE_API_BASE_URL=http://localhost:5000
  VITE_API_PATH=/api
  ```

- `.env.production` - Used for production builds (VPS deployment)
  ```
  VITE_API_BASE_URL=https://ajamassage.de
  VITE_API_PATH=/api
  ```

## How It Works

### 1. API Configuration Utility

The `apiConfig.js` utility provides functions to generate API URLs:

```javascript
// src/utils/apiConfig.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_PATH = import.meta.env.VITE_API_PATH || '/api';

export const getApiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  return `${API_BASE_URL}${API_PATH}/${cleanEndpoint}`;
};

export const getAssetUrl = (path) => {
  const cleanPath = path?.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
};
```

### 2. Usage in Components

Components use the utility functions to construct API URLs:

```javascript
import { getApiUrl, getAssetUrl } from '../utils/apiConfig';

// API calls
const response = await fetch(getApiUrl('messages'), {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData),
});

// Image URLs
<img src={getAssetUrl(photo.url)} alt="Gallery" />
```

### 3. Vite Configuration

The Vite development server is configured to use the same environment variables:

```javascript
// vite.config.js
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.');
  
  return {
    // ...
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:5000',
          // ...
        },
      },
    },
  }
});
```

## Deployment Considerations

When deploying to the VPS server:

1. Make sure the `.env.production` file has the correct values:
   ```
   VITE_API_BASE_URL=https://ajamassage.de
   VITE_API_PATH=/api
   ```

2. Build the application with:
   ```bash
   npm run build
   ```

3. Configure the web server to:
   - Serve the static files from the `dist` directory
   - Proxy API requests to the backend server

## Troubleshooting

If API calls are not working after deployment:

1. Check the network tab in browser dev tools to see the actual URLs being requested
2. Verify that the `.env.production` file was used during the build process
3. Ensure the web server is correctly proxying API requests to the backend
4. Check for CORS issues in the backend server configuration
