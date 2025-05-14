# AJA Massage Website

## Deployment Guide for VPS Server

### Environment Configuration

The application now uses environment variables for API configuration, making it easy to deploy to different environments without code changes.

- `.env` - Development environment settings
- `.env.production` - Production environment settings for VPS deployment

### API Configuration

The API URLs are now dynamically configured through the `apiConfig.js` utility. This ensures that all API calls will work correctly when deployed to the VPS server.

```javascript
// API configuration is handled by this utility
import { getApiUrl, getAssetUrl } from '../utils/apiConfig';

// Example usage:
const response = await fetch(getApiUrl('messages'));
```

### VPS Deployment Steps

1. Build the application for production:
   ```bash
   npm run build
   ```

2. Upload the `dist` folder to your VPS server

3. Configure your web server (Nginx/Apache) to serve the static files and proxy API requests to the backend server

#### Nginx Configuration Example

```nginx
server {
    listen 80;
    server_name ajamassage.de www.ajamassage.de;

    # Redirect to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name ajamassage.de www.ajamassage.de;

    # SSL configuration
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Frontend static files
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Mobile Menu Updates

The mobile menu has been updated to include the "Randevu Al" (Book Appointment) link, which was previously hidden on mobile devices.
