import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL || '';

const API = axios.create({
  baseURL: `${backendUrl}/api`,
});

API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');

  if (userInfo) {
    try {
      const { token } = JSON.parse(userInfo);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error parsing userInfo from localStorage:', error);
    }
  }

  return config;
});

export default API;

export const getImageUrl = (path) => {
  if (!path) {
    return 'https://via.placeholder.com/400x300?text=No+Image';
  }

  if (typeof path === 'string' && path.startsWith('http')) {
    return path;
  }

  const safePath = typeof path === 'string' ? path : String(path);
  return safePath.startsWith('/') ? safePath : `/${safePath}`;
};

export const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);

export const getEffectivePrice = (product) =>
  product?.discountPrice > 0
    ? product.discountPrice
    : product?.price || 0;