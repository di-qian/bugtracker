import express from 'express';
const router = express.Router();
import {
  getUsers,
  getUserById,
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

//router.route('/').get(getUsers);
//router.route('/:id').get(getUserById);
router.route('/').post(registerUser);
router.route('/login').post(authUser);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router;
