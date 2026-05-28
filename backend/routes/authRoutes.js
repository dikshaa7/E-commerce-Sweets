const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  adminLogin,
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  getUserById,
  toggleBlockUser,
  deleteUser,
  addAddress,
  updateAddress,
  deleteAddress,
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/admin/login', adminLogin);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/addresses', protect, addAddress);
router.put('/addresses/:addressId', protect, updateAddress);
router.delete('/addresses/:addressId', protect, deleteAddress);
router.get('/users', protect, admin, getAllUsers);
router.get('/users/:id', protect, admin, getUserById);
router.put('/users/:id/toggle-block', protect, admin, toggleBlockUser);
router.delete('/users/:id', protect, admin, deleteUser);

module.exports = router;
