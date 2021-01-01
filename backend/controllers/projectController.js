import asyncHandler from 'express-async-handler';
import isEmpty from 'is-empty';
import Project from '../models/projectModel.js';
import {
  validateNewProjectInput,
  validateEditProjectInput,
} from '../utils/validateForm.js';

// @desc    Fetch all projects
// @route   GET /api/projects
// @access  Public
const getProjects = asyncHandler(async (req, res) => {
  const pageSize = 5;
  const page = Number(req.query.pageNumber) || 1;

  const allprojects = await Project.find({});
  const count = await Project.countDocuments({});
  const projects = await Project.find({})
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .populate('managerAssigned', 'name');
  res.json({ allprojects, projects, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single project
// @route   GET /api/projects/:id
// @access  Public

const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id).populate(
    'managerAssigned',
    'name image'
  );

  if (project) {
    res.json(project);
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project) {
    await project.remove();
    res.json({ message: 'Project removed' });
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

// @desc    Create a project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = asyncHandler(async (req, res) => {
  const { errors } = validateNewProjectInput({
    name: req.body.name,
    managerAssigned: req.body.managerAssigned,
  });

  // Check validation
  if (!isEmpty(errors)) {
    return res.status(400).json(errors);
  }

  const project = new Project({
    name: req.body.name,
    managerAssigned: req.body.managerAssigned,
  });

  const createdProject = await project.save();
  res.status(201).json(createdProject);
});

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProject = asyncHandler(async (req, res) => {
  const { name, managerAssigned, members } = req.body;

  const { errors } = validateEditProjectInput({
    name,
  });

  // Check validation
  if (!isEmpty(errors)) {
    return res.status(400).json(errors);
  }

  const project = await Project.findById(req.params.id);

  if (project) {
    project.name = name;
    project.managerAssigned = managerAssigned;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } else {
    res.status(404);
    throw new Error('Project not found');
  }
});

export {
  getProjects,
  getProjectById,
  deleteProject,
  createProject,
  updateProject,
};
