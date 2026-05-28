const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getHomeProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleAvailability,
  getLowStockProducts,
  updateStock,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/home', getHomeProducts);
router.get('/low-stock', protect, admin, getLowStockProducts);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, admin, upload.single('image'), createProduct);
router.put('/:id', protect, admin, upload.single('image'), updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.put('/:id/toggle', protect, admin, toggleAvailability);
router.put('/:id/stock', protect, admin, updateStock);

module.exports = router;
