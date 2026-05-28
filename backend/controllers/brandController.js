const Brand = require('../models/Brand');

const getBrands = async (req, res) => {
  try {
    const filter = req.user?.role === 'admin' ? {} : { isActive: true };
    const brands = await Brand.find(filter).sort({ name: 1 });
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBrand = async (req, res) => {
  try {
    const brand = await Brand.create({
      name: req.body.name,
      logo: req.file ? `/uploads/${req.file.filename}` : req.body.logo || '',
      isActive: req.body.isActive !== 'false',
    });
    res.status(201).json(brand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return res.status(404).json({ message: 'Brand not found' });
    brand.name = req.body.name || brand.name;
    if (req.file) brand.logo = `/uploads/${req.file.filename}`;
    else if (req.body.logo !== undefined) brand.logo = req.body.logo;
    if (req.body.isActive !== undefined) brand.isActive = req.body.isActive === 'true' || req.body.isActive === true;
    const updated = await brand.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return res.status(404).json({ message: 'Brand not found' });
    await brand.deleteOne();
    res.json({ message: 'Brand deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return res.status(404).json({ message: 'Brand not found' });
    brand.isActive = !brand.isActive;
    await brand.save();
    res.json(brand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBrands, createBrand, updateBrand, deleteBrand, toggleBrand };
