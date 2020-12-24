import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import isEmpty from 'is-empty';
import User from '../models/userModel.js';
import {
  validateRegisterInput,
  validateLoginInput,
} from '../utils/validateForm.js';

// @desc    Fetch Users
// @route   GET /api/users
// @access  Public
const getUsers = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const count = await User.countDocuments({});
  const users = await User.find({})
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.json({ users, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single user
// @route   GET /api/users/:id
// @access  Public
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Auth user and get password
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { errors, isValid } = validateLoginInput(req.body);

  const user = await User.findOne({ email });

  if (user) {
    if (await user.matchPassword(password)) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        isAdmin: user.isAdmin,
        isManager: user.isManager,
        token: generateToken(user._id),
      });
    } else {
      if (!errors.password) {
        errors.password = 'Password is incorrect';
        res.status(400);
      }
    }
  } else {
    if (!errors.email) {
      errors.email = 'Email not found';
      res.status(400);
    }
  }

  // Check validation
  if (!isEmpty(errors)) {
    return res.status(400).json(errors);
  }

  // if (user && (await user.matchPassword(password))) {
  //   res.json({
  //     _id: user._id,
  //     name: user.name,
  //     email: user.email,
  //     image: user.image,
  //     isAdmin: user.isAdmin,
  //     isManager: user.isManager,
  //     token: generateToken(user._id),
  //   });
  // } else {
  //   res.status(401);
  //   throw new Error('Invalid email or password');
  // }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  const { errors } = validateRegisterInput({
    name,
    email,
    password,
    confirmPassword,
  });
  const userExists = await User.findOne({ email });

  if (userExists) {
    errors.email = 'User email is already registered';
    //isValid: isEmpty(errors);
    res.status(400);
    //throw new Error('User already exists');
  }

  // Check validation
  if (!isEmpty(errors)) {
    return res.status(400).json(errors);
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (req.body.image) {
    user.image = req.body.image;
  }
  if (req.body.isAdmin) {
    user.isAdmin = req.body.isAdmin;
  }
  if (req.body.isManager) {
    user.isManager = req.body.isManager;
  }

  const updatedUser = await user.save();

  if (updatedUser) {
    res.status(201).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      image: updatedUser.image,
      isAdmin: updatedUser.isAdmin,
      isManager: updatedUser.isManager,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    GET user profile
// @route   POST /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      isAdmin: user.isAdmin,
      isManager: user.isManager,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    if (req.body.image) {
      user.image = req.body.image;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      image: updatedUser.image,
      isAdmin: updatedUser.isAdmin,
      isManager: updatedUser.isManager,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    if (req.body.image) {
      user.image = req.body.image;
    }
    user.isAdmin = req.body.isAdmin;
    user.isManager = req.body.isManager;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      image: updatedUser.image,
      isAdmin: updatedUser.isAdmin,
      isManager: updatedUser.isManager,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export {
  getUsers,
  getUserById,
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  deleteUser,
  updateUser,
};
