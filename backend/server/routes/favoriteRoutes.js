const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

// ✅ Add Favorite Route to user
router.post('/:userId', async (req, res) => {
  try {
    const { fromStation, toStation, routeName } = req.body;

    if (!fromStation || !toStation || !routeName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const newRoute = { fromStation, toStation, routeName };
    user.favoriteRoutes.push(newRoute);
    await user.save();

    const createdRoute = user.favoriteRoutes[user.favoriteRoutes.length - 1];
    return res.status(201).json(createdRoute);
  } catch (err) {
    console.error("Add route error:", err);
    return res.status(500).json({ error: 'Failed to add favorite route' });
  }
});

// ✅ Get all favorite routes of a user
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(user.favoriteRoutes);
  } catch (err) {
    console.error("Get routes error:", err);
    res.status(500).json({ error: 'Failed to get favorite routes' });
  }
});

// ✅ Update a favorite route
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
    console.error("Update route error:", err);
    res.status(500).json({ error: 'Failed to update favorite route' });
  }
});

// ✅ Delete a favorite route
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
    console.error("Delete route error:", err);
    res.status(500).json({ error: 'Failed to delete favorite route' });
  }
});

module.exports = router;
