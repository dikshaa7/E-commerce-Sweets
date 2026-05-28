const Cart = require('../models/Cart');
const Product = require('../models/Product');

const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      populate: [{ path: 'brand', select: 'name' }, { path: 'category', select: 'name' }],
    });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    const total = cart.items.reduce((sum, item) => {
      const price = item.product?.discountPrice > 0 ? item.product.discountPrice : item.product?.price || 0;
      return sum + price * item.quantity;
    }, 0);
    res.json({ cart, total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product || !product.isAvailable) {
      return res.status(400).json({ message: 'Product not available' });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
    const existing = cart.items.find((i) => i.product.toString() === productId);
    if (existing) {
      existing.quantity += quantity;
      if (existing.quantity > product.stock) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
    } else {
      cart.items.push({ product: productId, quantity });
    }
    await cart.save();
    cart = await Cart.findById(cart._id).populate('items.product');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    const item = cart.items.find((i) => i.product.toString() === req.params.productId);
    if (!item) return res.status(404).json({ message: 'Item not in cart' });
    const product = await Product.findById(req.params.productId);
    if (quantity > product.stock) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }
    if (quantity <= 0) {
      cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
    } else {
      item.quantity = quantity;
    }
    await cart.save();
    const updated = await Cart.findById(cart._id).populate('items.product');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
    await cart.save();
    const updated = await Cart.findById(cart._id).populate('items.product');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
