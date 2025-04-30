const express = require('express');
const router = express.Router();
const feedbackPostModel = require('../../models/FeedbackPostModel');
const mongoose = require('mongoose');

router.put('/feedback/:id', async (req, res) =>{
    const { id } = req.params;
    const {username, comment, station} = req.body;
    
    try{
        const updatedPost = await feedbackPostModel.findById(id);
        if (!updatedPost) {
            return res.status(404).json({ error: "Post not found" });
        }
        updatedPost.username = username;
        updatedPost.comment = comment;
        updatedPost.station = station;

        await updatedPost.save();
        res.json({message: ' Post has been updated ', updatedPost});
    }

    catch(err){
        console.error("Post Update Error", err);
        res.status(500).json({error: 'Error updating post'});
    }
});


module.exports = router;