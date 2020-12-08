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
  const bug = await Bug.findById(req.params.id).populate(
    'assignedTo',
    'name email'
  );

  if (bug) {
    res.json(bug);
  } else {
    res.status(404);
    throw new Error('Bug not found');
  }
});

// @desc    Delete a bug
// @route   DELETE /api/bugs/:id
// @access  Private
const deleteBug = asyncHandler(async (req, res) => {
  const bug = await Bug.findById(req.params.id);

  if (bug) {
    await bug.remove();
    res.json({ message: 'Bug removed' });
  } else {
    res.status(404);
    throw new Error('Bug not found');
  }
});

// @desc    Create a bug
// @route   POST /api/bugs
// @access  Private
const createBug = asyncHandler(async (req, res) => {
  const bug = new Bug({
    name: 'Sample name',
    image: '/images/sample.jpg',
    description: 'Sample description',
    project: '5fc85f0d14a77c1154cb8a5a',
    priority: 'Normal',
    resolvedBy: '2019-01-31T10:00:00.000Z',
    resolvedAt: '2019-01-31T10:00:00.000Z',
    createdBy: req.user._id,
    assignedTo: req.user._id,
    comments: [],
  });

  const createdBug = await bug.save();
  res.status(201).json(createdBug);
});

// @desc    Update a bug
// @route   PUT /api/bugs/:id
// @access  Private
const updateBug = asyncHandler(async (req, res) => {
  const {
    name,
    image,
    description,
    project,
    priority,
    resolvedBy,
    resolvedAt,
    createdBy,
    assignedTo,
    comments,
  } = req.body;

  const bug = await Bug.findById(req.params.id);

  if (bug) {
    bug.name = name;
    bug.image = image;
    bug.description = description;
    bug.project = project;
    bug.priority = priority;
    bug.resolvedBy = resolvedBy;
    bug.resolvedAt = resolvedAt;
    bug.createdBy = createdBy;
    bug.assignedTo = assignedTo;
    bug.comments = comments;

    const updatedBug = await bug.save();
    res.json(updatedBug);
  } else {
    res.status(404);
    throw new Error('Bug not found');
  }
});

export { getBugById, getBugs, deleteBug, createBug, updateBug };
