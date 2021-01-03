import asyncHandler from 'express-async-handler';
import isEmpty from 'is-empty';
import Bug from '../models/bugModel.js';
import User from '../models/userModel.js';
import {
  validateNewBugInput,
  validateEditBugInput,
} from '../utils/validateForm.js';
// @desc    Fetch all bugs
// @route   GET /api/bugs
// @access  Public
const getBugs = asyncHandler(async (req, res) => {
  const pageSize = 5;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const count = await Bug.countDocuments({ ...keyword });
  const bugs = await Bug.find({ ...keyword })
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .populate('project', 'name')
    .populate('assignedTo', 'name email image');

  res.json({ bugs, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single bug
// @route   GET /api/bugs/:id
// @access  Public
const getBugById = asyncHandler(async (req, res) => {
  const bug = await Bug.findById(req.params.id)
    .populate('project', 'name')
    .populate({ path: 'project', populate: { path: 'managerAssigned' } })
    .populate('assignedTo', 'name email image');

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
  const temp_assignTo = req.body.assignedTo ? req.body.assignedTo : null;

  const { errors } = validateNewBugInput({
    name: req.body.name,
    description: req.body.description,
    project: req.body.project,
    priority: req.body.priority,
    image: req.body.image,
  });

  // Check validation
  if (!isEmpty(errors)) {
    return res.status(400).json(errors);
  }

  const bug = new Bug({
    name: req.body.name,
    image: req.body.image,
    description: req.body.description,
    project: req.body.project,
    priority: req.body.priority,
    resolvedBy: req.body.resolvedBy,
    assignedTo: temp_assignTo,
  });

  const createdBug = await bug.save();

  const bugCreateComment = {
    user: req.user._id,
    name: req.user.name,
    image: req.user.image,
    comment: 'created the task.',
  };

  createdBug.comments.push(bugCreateComment);

  if (temp_assignTo) {
    const assignedTo_user = await User.findById(temp_assignTo);
    const bugAssignComment = {
      user: req.user._id,
      name: req.user.name,
      image: req.user.image,
      comment: 'assigned the task to ' + assignedTo_user.name + '.',
    };
    createdBug.comments.push(bugAssignComment);
  }

  await createdBug.save();

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
    assignedTo,
    comments,
  } = req.body;

  const { errors } = validateEditBugInput({
    name,
    description,
    resolvedBy,
    image,
  });

  // Check validation
  if (!isEmpty(errors)) {
    return res.status(400).json(errors);
  }

  const bug = await Bug.findById(req.params.id);

  if (bug) {
    bug.name = name;
    bug.image = image;
    bug.description = description;
    bug.project = project;
    bug.priority = priority;
    bug.resolvedBy = resolvedBy;
    bug.resolvedAt = resolvedAt;
    bug.assignedTo = assignedTo;
    bug.comments = comments;

    await bug.save();

    const updatedBug = await Bug.findById(req.params.id)
      .populate('project', 'name')
      .populate({ path: 'project', populate: { path: 'managerAssigned' } })
      .populate('assignedTo', 'name email image');

    res.json(updatedBug);
  } else {
    res.status(404);
    throw new Error('Bug not found');
  }
});

// @desc    Remove assignedTo from a bug
// @route   PUT /api/bugs/:id/rmassignedto
// @access  Private
const removeBugAssignee = asyncHandler(async (req, res) => {
  const bug = await Bug.findById(req.params.id);
  if (bug) {
    await Bug.update({ _id: req.params.id }, { $unset: { assignedTo: '' } });
    const updatedbug = await Bug.findById(req.params.id);
    res.json(updatedbug);
  } else {
    res.status(404);
    throw new Error('(Unassignee) Bug not found');
  }
});

// @desc    Create new comment
// @route   POST /api/bugs/:id/trackers
// @access  Private
const createBugComment = asyncHandler(async (req, res) => {
  const { combined_comment } = req.body;

  const bug = await Bug.findById(req.params.id);

  if (bug) {
    // const alreadyReviewed = bug.comments.find(
    //   (r) => r.user.toString() === req.user._id.toString()
    // )

    // if (alreadyReviewed) {
    //   res.status(400)
    //   throw new Error('commenter already commented')
    // }

    const bugComment = {
      user: req.user._id,
      name: req.user.name,
      image: req.user.image,
      comment: combined_comment,
    };

    bug.comments.push(bugComment);

    //product.numReviews = product.reviews.length;

    // product.rating =
    //   product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    //   product.reviews.length;

    await bug.save();

    const updatedBug = await Bug.findById(req.params.id)
      .populate('project', 'name')
      .populate({ path: 'project', populate: { path: 'managerAssigned' } })
      .populate('assignedTo', 'name email image');

    res.json(updatedBug);
    //res.status(201).json({ message: 'New track log item added' });
  } else {
    res.status(404);
    throw new Error('Bug not found');
  }
});

export {
  getBugById,
  getBugs,
  deleteBug,
  createBug,
  updateBug,
  removeBugAssignee,
  createBugComment,
};
