const express = require('express');
const PreferredRouteModel = require('../models/PreferredRouteModel'); // Updated Model Name

const router = express.Router();

// ✅ Update Preferred Route for a User
router.put('/preferred-routes/:userId', async (req, res) => {
    try {
        const { userId } = req.params; // Extract user ID from URL
        const updateData = req.body; // Data for updating the route

        // Ensure update data is provided
        if (!updateData || Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: "Update data is required" });
        }

        // Find and update the preferred route for the user
        const updatedRoute = await PreferredRouteModel.findOneAndUpdate(
            { userId },  // Search by userId
            updateData,  // Update fields (routeId, routeName)
            { new: true, upsert: true } // Return updated record, create if not found
        );

        res.json({
            message: "Preferred route updated successfully",
            updatedRoute
        });

    } catch (error) {
        console.error("Error updating preferred route:", error);
        res.status(500).json({ error: "Failed to update preferred route" });
    }
});

module.exports = router;
