const express = require('express');
const PreferredRouteModel = require('../models/PreferredRouteModel');

const router = express.Router();

/**
 * PUT /preferred-routes/:userId
 */
router.put('/preferred-routes/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const updateData = req.body;

        if (!updateData || Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: "Update data is required" });
        }

        const updatedRoute = await PreferredRouteModel.findOneAndUpdate(
            { userId },
            updateData,
            { new: true, upsert: true }
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

/**
 * PUT /mbta-routes/:routeId
 */
router.put('/mbta-routes/:routeId', async (req, res) => {
    try {
        const { routeId } = req.params;
        const updateData = req.body;

        if (!updateData || Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: "Update data is required" });
        }

        const updatedRoute = await PreferredRouteModel.findOneAndUpdate(
            { routeId },
            updateData,
            { new: true, upsert: true }
        );

        res.json({
            message: `Route '${routeId}' updated successfully`,
            updatedRoute
        });
    } catch (error) {
        console.error(`Error updating route '${req.params.routeId}':`, error);
        res.status(500).json({ error: "Failed to update route" });
    }
});


// ✅ ВСТАВКА: Вызов обновления прямо на старте (для теста)
async function testInternalUpdate() {
    try {
        const routeId = "Blue";
        const updateData = {
            routeName: "Blue Line - Internal Update",
            userId: "internal-user-1"
        };

        const updated = await PreferredRouteModel.findOneAndUpdate(
            { routeId },
            updateData,
            { new: true, upsert: true }
        );

        console.log("✅ Internal update succeeded:", updated);
    } catch (err) {
        console.error("❌ Internal update failed:", err);
    }
}

// Вызов после задержки, чтобы Mongoose точно подключился (если нужно)
setTimeout(() => {
    testInternalUpdate();
}, 1000);

module.exports = router;
