const Offer = require('../models/Offer');
const Product = require('../models/Product');

const getOffers = async (req, res) => {
  try {
    const filter = req.user?.role === 'admin' ? {} : { isActive: true };
    const offers = await Offer.find(filter)
      .populate('product', 'name image price')
      .populate('category', 'name')
      .sort({ createdAt: -1 });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createOffer = async (req, res) => {
  try {
    const offer = await Offer.create(req.body);
    if (offer.product && offer.discountPercent) {
      const product = await Product.findById(offer.product);
      if (product) {
        product.discountPrice = Math.round(product.price * (1 - offer.discountPercent / 100));
        await product.save();
      }
    }
    const populated = await Offer.findById(offer._id).populate('product category');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: 'Offer not found' });
    Object.assign(offer, req.body);
    await offer.save();
    if (offer.product && offer.discountPercent) {
      const product = await Product.findById(offer.product);
      if (product) {
        product.discountPrice = Math.round(product.price * (1 - offer.discountPercent / 100));
        await product.save();
      }
    }
    const populated = await Offer.findById(offer._id).populate('product category');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: 'Offer not found' });
    if (offer.product) {
      const product = await Product.findById(offer.product);
      if (product) {
        product.discountPrice = 0;
        await product.save();
      }
    }
    await offer.deleteOne();
    res.json({ message: 'Offer removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getOffers, createOffer, updateOffer, deleteOffer };
