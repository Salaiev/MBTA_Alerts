console.log("userRoutes.js is loaded");

const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

// Create User
router.post('/signup', async (req, res) => {
  try {
    const { name, lastname, email, password } = req.body;

    if (!name || !lastname || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const user = new User({ name, lastname, email, password });
    await user.save();

    res.status(201).json({ message: 'User created', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during signup' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password }); // WARNING: no hashing here

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Update User
router.put('/editUser/:id', async (req, res) => {
  try {
    const { name, lastname, email, password } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, lastname, email, password },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User updated', user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete User
router.delete('/deleteUser/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
