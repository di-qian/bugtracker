import express from 'express';
const router = express.Router();
import {
  getProjects,
  getProjectById,
  deleteProject,
  createProject,
  updateProject,
  getProjectBugs,
} from '../controllers/projectController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(getProjects).post(protect, admin, createProject);

router
  .route('/:id')
  .get(getProjectById)
  .delete(protect, admin, deleteProject)
  .put(protect, admin, updateProject);

router.route('/:id/bugs').get(protect, admin, getProjectBugs);
export default router;
