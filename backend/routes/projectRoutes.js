import express from 'express';
import asyncHandler from 'express-async-handler';
const router = express.Router();
import Project from '../models/projectModel.js';

// @desc    Fetch all projects
// @route   GET /api/projects
// @access  Public
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const projects = await Project.find({});
    res.json(projects);
  })
);

// @desc    Fetch single project
// @route   GET /api/projects/:id
// @access  Public
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (project) {
      res.json(project);
    } else {
      res.status(404);
      throw new Error('Project not found');
    }
  })
);

export default router;
