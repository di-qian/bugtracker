import express from 'express';
const router = express.Router();
import {
  getUsers,
  getUserById,
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  deleteUser,
  updateUser,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

//router.route('/').get(getUsers);
//router.route('/:id').get(getUserById);
router.route('/').post(registerUser).get(protect, getUsers);
router.route('/login').post(authUser);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router
  .route('/:id')
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);

export default router;
