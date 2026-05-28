const Banner = require('../models/Banner');

const getBanners = async (req, res) => {
  try {
    const filter = req.user?.role === 'admin' ? {} : { isActive: true };
    const banners = await Banner.find(filter).sort({ order: 1 });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBanner = async (req, res) => {
  try {
    const banner = await Banner.create({
      title: req.body.title,
      subtitle: req.body.subtitle || '',
      image: req.file ? `/uploads/${req.file.filename}` : req.body.image || '',
      link: req.body.link || '/products',
      isActive: req.body.isActive !== 'false',
      order: Number(req.body.order) || 0,
    });
    res.status(201).json(banner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });
    banner.title = req.body.title || banner.title;
    banner.subtitle = req.body.subtitle ?? banner.subtitle;
    banner.link = req.body.link ?? banner.link;
    if (req.file) banner.image = `/uploads/${req.file.filename}`;
    else if (req.body.image !== undefined) banner.image = req.body.image;
    if (req.body.isActive !== undefined) banner.isActive = req.body.isActive === 'true' || req.body.isActive === true;
    if (req.body.order !== undefined) banner.order = Number(req.body.order);
    await banner.save();
    res.json(banner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });
    await banner.deleteOne();
    res.json({ message: 'Banner deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });
    banner.isActive = !banner.isActive;
    await banner.save();
    res.json(banner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBanners, createBanner, updateBanner, deleteBanner, toggleBanner };
