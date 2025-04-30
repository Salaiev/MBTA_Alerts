const express = require('express');
const router = express.Router();
const feedbackPostModel = require('../../models/FeedbackPostModel');
const mongoose = require('mongoose');

router.get('/getPost/:id', async (req, res) => {
    try{
        const { id } = req.params;
    
        if(!mongoose.Types.ObjectId.isValid(id)){
                return res.status(400).json({error: 'Invalid postID' });
        }

        const getFeedbackPost = await feedbackPostModel.findById(req.params.id);
        
        if (!getFeedbackPost){
            return res.status(404).json({ error: 'Post not found' });
        }

        res.json(getFeedbackPost);

        
    } catch (err) {
        res.status(500).json({error: 'Failed to retrieve feedback post'});
    }
});

router.get('/getPost', async (req, res) => {
    try{
        const allFeedbackPosts = await feedbackPostModel.find()
        return res.status(200).json(allFeedbackPosts)
    }
    catch(err){
        return res.status(500).json({error: 'Failed to fetch all feedbackPosts'});
    }
});

module.exports = router;
