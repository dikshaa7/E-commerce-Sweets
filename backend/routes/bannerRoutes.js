const express = require('express');
const router = express.Router();
const { getBanners, createBanner, updateBanner, deleteBanner, toggleBanner } = require('../controllers/bannerController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getBanners);
router.post('/', protect, admin, upload.single('image'), createBanner);
router.put('/:id', protect, admin, upload.single('image'), updateBanner);
router.delete('/:id', protect, admin, deleteBanner);
router.put('/:id/toggle', protect, admin, toggleBanner);

module.exports = router;
