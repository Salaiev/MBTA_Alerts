console.log(" userRoutes.js is loaded");

const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

//  Signup
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, city, preferredRoute } = req.body;

    if (!username || !email || !password || !city) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const user = new User({ username, email, password, city, preferredRoute });
    await user.save();

    res.status(201).json({ message: 'User created', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during signup' });
  }
});

//  Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username, password }); // WARNING: Hash in production

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ error: 'Server error during login' });
  }
});

//  Get All Users
router.get('/getAll', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

//  Update User
router.put('/editUser/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, email, password, city, preferredRoute } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email, password, city, preferredRoute },
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

//  Get User by ID
router.get('/getUserById/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve user' });
  }
});

//  Delete All Users
router.delete('/deleteAll', async (req, res) => {
  try {
    await User.deleteMany({});
    res.json({ message: 'All users deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete users' });
  }
});

//  Delete by ID
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
