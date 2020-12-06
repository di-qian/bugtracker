import asyncHandler from 'express-async-handler';
import Bug from '../models/bugModel.js';

// @desc    Fetch all bugs
// @route   GET /api/bugs
// @access  Public
const getBugs = asyncHandler(async (req, res) => {
  const bugs = await Bug.find({})
    .populate('project', 'name')
    .populate('assignedTo', 'name email');
  res.json(bugs);
});

// @desc    Fetch single bug
// @route   GET /api/bugs/:id
// @access  Public
const getBugById = asyncHandler(async (req, res) => {
  const bug = await Bug.findById(req.params.id);

  if (bug) {
    res.json(bug);
  } else {
    res.status(404);
    throw new Error('Bug not found');
  }
});

export { getBugById, getBugs };
