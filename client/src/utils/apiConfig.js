/**
 * API configuration utility
 * This file centralizes API URL configuration for easy deployment to different environments
 */

// Get the base URL and API path from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_PATH = import.meta.env.VITE_API_PATH || '/api';

/**
 * Constructs a full API URL based on the endpoint
 * @param {string} endpoint - The API endpoint (without leading slash)
 * @returns {string} The complete API URL
 */
export const getApiUrl = (endpoint) => {
  // Remove leading slash from endpoint if it exists
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  return `${API_BASE_URL}${API_PATH}/${cleanEndpoint}`;
};

/**
 * Returns the base URL for assets (images, etc.)
 * @returns {string} The base URL for assets
 */
export const getAssetUrl = (path) => {
  // Remove leading slash from path if it exists
  const cleanPath = path?.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
};

export default {
  getApiUrl,
  getAssetUrl,
  API_BASE_URL,
  API_PATH
};
