const express = require('express');
const router = express.Router();
const feedbackPostModel = require('../../models/FeedbackPostModel');
const mongoose = require('mongoose');

router.post('/createPost', async (req, res) => {
    console.log(req.body); // Log the incoming data
    try {
      const { username, comment, station } = req.body;
      if (!username || !comment || !station) {
        return res.status(400).json({ error: 'All fields are required' });
      }
      const feedbackPost = new feedbackPostModel({ username, comment, station });
      await feedbackPost.save();
      res.status(201).json({ message: 'Post created', feedbackPost });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error during post' });
    }
  });

module.exports = router;