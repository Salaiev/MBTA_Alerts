const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

// Add Favorite Route to user
router.post('/:userId', async (req, res) => {
  try {
    const { fromStation, toStation, routeName } = req.body;

    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const newRoute = { fromStation, toStation, routeName };
    user.favoriteRoutes.push(newRoute);
    await user.save();

    res.status(201).json({ message: 'Favorite route added', favoriteRoutes: user.favoriteRoutes });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add favorite route' });
  }
});

// Get all favorite routes of a user
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(user.favoriteRoutes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get favorite routes' });
  }
});

// Update a favorite route
router.put('/:userId/:routeId', async (req, res) => {
  try {
    const { fromStation, toStation, routeName } = req.body;

    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const route = user.favoriteRoutes.id(req.params.routeId);
    if (!route) return res.status(404).json({ error: 'Route not found' });

    route.fromStation = fromStation;
    route.toStation = toStation;
    route.routeName = routeName;
    await user.save();

    res.json({ message: 'Favorite route updated', route });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update favorite route' });
  }
});

// Delete a favorite route
router.delete('/:userId/:routeId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const route = user.favoriteRoutes.id(req.params.routeId);
    if (!route) return res.status(404).json({ error: 'Route not found' });

    route.remove();
    await user.save();

    res.json({ message: 'Favorite route deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete favorite route' });
  }
});

module.exports = router;
