import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

export const getImageUrl = (path) => {
  if (!path) return 'https://via.placeholder.com/400x300?text=No+Image';
  if (path.startsWith('http')) return path;
  return path;
};

export const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

export const getEffectivePrice = (product) =>
  product?.discountPrice > 0 ? product.discountPrice : product?.price || 0;
