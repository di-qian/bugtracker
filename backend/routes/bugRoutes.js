import express from 'express';
const router = express.Router();
import {
  getBugs,
  getBugById,
  deleteBug,
  createBug,
  updateBug,
} from '../controllers/bugController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(getBugs).post(protect, createBug);
router
  .route('/:id')
  .get(getBugById)
  .delete(protect, admin, deleteBug)
  .put(protect, updateBug);

export default router;
