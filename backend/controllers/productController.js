const Product = require('../models/Product');

const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      weight,
      available,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const filter = {};
    if (req.user?.role !== 'admin') {
      filter.isAvailable = true;
    } else if (available === 'true') filter.isAvailable = true;
    else if (available === 'false') filter.isAvailable = false;

    if (search) filter.name = { $regex: search, $options: 'i' };
    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (weight) filter.weight = weight;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'name') sortOption = { name: 1 };

    const skip = (Number(page) - 1) * Number(limit);
    const products = await Product.find(filter)
      .populate('brand', 'name logo')
      .populate('category', 'name')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));
    const total = await Product.countDocuments(filter);
    res.json({ products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const product = await Product.findById(req.params.id)
      .populate('brand', 'name logo')
      .populate('category', 'name');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getHomeProducts = async (req, res) => {
  try {
    const baseFilter = { isAvailable: true };
    const [latest, popular, discounted, categories] = await Promise.all([
      Product.find({ ...baseFilter, isLatest: true }).populate('brand category').limit(8),
      Product.find({ ...baseFilter, isPopular: true }).populate('brand category').limit(8),
      Product.find({ ...baseFilter, discountPrice: { $gt: 0 } }).populate('brand category').limit(8),
      require('../models/Category').find({ isActive: true }).limit(6),
    ]);
    res.json({ latest, popular, discounted, categories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      name: req.body.name,
      image: req.file ? `/uploads/${req.file.filename}` : req.body.image || '',
      brand: req.body.brand,
      category: req.body.category,
      price: Number(req.body.price),
      discountPrice: Number(req.body.discountPrice) || 0,
      weight: req.body.weight,
      stock: Number(req.body.stock) || 0,
      description: req.body.description || '',
      ingredients: req.body.ingredients || '',
      shelfLife: req.body.shelfLife || '',
      isAvailable: req.body.isAvailable !== 'false',
      isPopular: req.body.isPopular === 'true' || req.body.isPopular === true,
      isLatest: req.body.isLatest === 'true' || req.body.isLatest === true,
      lowStockThreshold: Number(req.body.lowStockThreshold) || 10,
    });
    const populated = await Product.findById(product._id).populate('brand category');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const fields = ['name', 'brand', 'category', 'weight', 'description', 'ingredients', 'shelfLife'];
    fields.forEach((f) => { if (req.body[f] !== undefined) product[f] = req.body[f]; });
    if (req.file) product.image = `/uploads/${req.file.filename}`;
    else if (req.body.image !== undefined) product.image = req.body.image;
    if (req.body.price !== undefined) product.price = Number(req.body.price);
    if (req.body.discountPrice !== undefined) product.discountPrice = Number(req.body.discountPrice);
    if (req.body.stock !== undefined) product.stock = Number(req.body.stock);
    if (req.body.isAvailable !== undefined) product.isAvailable = req.body.isAvailable === 'true' || req.body.isAvailable === true;
    if (req.body.isPopular !== undefined) product.isPopular = req.body.isPopular === 'true' || req.body.isPopular === true;
    if (req.body.isLatest !== undefined) product.isLatest = req.body.isLatest === 'true' || req.body.isLatest === true;
    if (req.body.lowStockThreshold !== undefined) product.lowStockThreshold = Number(req.body.lowStockThreshold);
    const updated = await product.save();
    const populated = await Product.findById(updated._id).populate('brand category');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleAvailability = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    product.isAvailable = !product.isAvailable;
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({
      $expr: { $lte: ['$stock', '$lowStockThreshold'] },
    }).populate('brand category');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateStock = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    product.stock = Number(req.body.stock);
    if (product.stock === 0) product.isAvailable = false;
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getHomeProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleAvailability,
  getLowStockProducts,
  updateStock,
};
