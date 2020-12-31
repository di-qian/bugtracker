import express from 'express';
const router = express.Router();
import {
  getBugs,
  getBugById,
  deleteBug,
  createBug,
  updateBug,
  removeBugAssignee,
  createBugComment,
} from '../controllers/bugController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(getBugs).post(protect, createBug);
router.route('/:id/trackers').post(protect, createBugComment);
router.route('/:id/rmassignedto').put(protect, removeBugAssignee);
router
  .route('/:id')
  .get(getBugById)
  .delete(protect, admin, deleteBug)
  .put(protect, updateBug);

export default router;
