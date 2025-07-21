
// Configuration values loaded from .env file
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'E-Commerce App';
export const JWT_STORAGE_KEY = import.meta.env.VITE_JWT_STORAGE_KEY || 'auth_token';
export const CLOUDINARY_UPLOAD_URL = import.meta.env.VITE_CLOUDINARY_URL || 'https://api.cloudinary.com/v1_1/drvf09f8r/image/upload';

// Environment indicators
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;
