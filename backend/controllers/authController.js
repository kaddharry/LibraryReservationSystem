const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, rollNumber, branch, password } = req.body;

  try {
    const userExists = await User.findOne({ rollNumber });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      rollNumber,
      branch,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        rollNumber: user.rollNumber,
        branch: user.branch,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
  const { rollNumber, password } = req.body;

  try {
    const user = await User.findOne({ rollNumber });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        rollNumber: user.rollNumber,
        branch: user.branch,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid roll number or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, authUser };
