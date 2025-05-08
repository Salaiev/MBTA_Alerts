const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const jwt = require("jsonwebtoken");

// Create User (Signup)
router.post('/signup', async (req, res) => {
  try {
    const { name, lastname, username, email, password } = req.body;

    if (!name || !lastname || !username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const user = new User({ name, lastname, username, email, password });
    await user.save();

    res.status(201).json({ message: 'User created', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during signup' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        name: user.name,             //
        lastname: user.lastname,     // 
        email: user.email            //
      },
      process.env.ACCESS_TOKEN_SECRET || "secret123",
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ error: 'Server error during login' });
  }
});

// ✅ Update User by ID via :id param (e.g., /updateUserById/123)
router.put('/updateUserById/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, lastname, email, password } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (name) user.name = name;
    if (lastname) user.lastname = lastname;
    if (email) user.email = email;

    if (password) {
      const isStrong = password.length >= 6 && /[A-Za-z]/.test(password) && /\d/.test(password);
      if (!isStrong) {
        return res.status(400).json({
          error: "Password must be at least 6 characters and include both letters and numbers"
        });
      }
      user.password = password; // bcrypt колдонуп жатсаң, хэште
    }

    await user.save();
    res.json({ message: "User updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update user" });
  }
});


// Get All Users
router.get('/getAll', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get User by ID
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

// Delete User by ID
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

// Delete All Users
router.delete('/deleteAll', async (req, res) => {
  try {
    await User.deleteMany({});
    res.json({ message: 'All users deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete users' });
  }
});

module.exports = router;
