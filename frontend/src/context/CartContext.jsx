import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [cartCount, setCartCount] = useState(0);

  const fetchCart = useCallback(async () => {
    if (!user || user.role === 'admin') return;
    try {
      const { data } = await API.get('/cart');
      setCart(data);
      setCartCount(data.cart?.items?.reduce((s, i) => s + i.quantity, 0) || 0);
    } catch {
      setCart({ items: [], total: 0 });
      setCartCount(0);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    const { data } = await API.post('/cart', { productId, quantity });
    setCart({ cart: data, total: data.items.reduce((s, i) => {
      const p = i.product?.discountPrice > 0 ? i.product.discountPrice : i.product?.price || 0;
      return s + p * i.quantity;
    }, 0) });
    setCartCount(data.items.reduce((s, i) => s + i.quantity, 0));
  };

  const updateQuantity = async (productId, quantity) => {
    const { data } = await API.put(`/cart/${productId}`, { quantity });
    setCart({ cart: data });
    setCartCount(data.items.reduce((s, i) => s + i.quantity, 0));
  };

  const removeFromCart = async (productId) => {
    const { data } = await API.delete(`/cart/${productId}`);
    setCart({ cart: data });
    setCartCount(data.items.reduce((s, i) => s + i.quantity, 0));
  };

  return (
    <CartContext.Provider value={{ cart, cartCount, fetchCart, addToCart, updateQuantity, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
