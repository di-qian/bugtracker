import express from 'express';
import asyncHandler from 'express-async-handler';
const router = express.Router();
import Bug from '../models/bugModel.js';

// @desc    Fetch all bugs
// @route   GET /api/bugs
// @access  Public
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const bugs = await Bug.find({});
    res.json(bugs);
  })
);

// @desc    Fetch single bug
// @route   GET /api/bugs/:id
// @access  Public
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const bug = await Bug.findById(req.params.id);

    if (bug) {
      res.json(bug);
    } else {
      res.status(404);
      throw new Error('Bug not found');
    }
  })
);

export default router;
