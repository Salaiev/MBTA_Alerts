const express = require('express');
const router = express.Router();
const feedbackPostModel = require('../../models/FeedbackPostModel');
const mongoose = require('mongoose');

router.delete('/feedback/:id', async (req, res) =>{
    try{
        const { id } = req.params;
    
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({error: 'Invalid postID' });
        }

        const deletedPost = await feedbackPostModel.findByIdAndDelete(id);

        if (!deletedPost) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.status(200).json({message:'Post deleted', deletedPost});

    } catch (err){
        console.error(err);
        res.status(500).json({error: 'Server Failed to delete post'});
    }
});

router.delete('/feedback', async (req,res) => {
    try{
        await feedbackPostModel.deleteMany({});
        res.json({message: 'All posts deleted'});
    } catch (err){
        res.status(500).json({error: 'Failed to delete post'});
    
    }

});

module.exports = router;