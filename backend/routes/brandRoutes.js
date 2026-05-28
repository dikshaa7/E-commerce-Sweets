const express = require('express');
const router = express.Router();
const { getBrands, createBrand, updateBrand, deleteBrand, toggleBrand } = require('../controllers/brandController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getBrands);
router.post('/', protect, admin, upload.single('logo'), createBrand);
router.put('/:id', protect, admin, upload.single('logo'), updateBrand);
router.delete('/:id', protect, admin, deleteBrand);
router.put('/:id/toggle', protect, admin, toggleBrand);

module.exports = router;
