const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

const MBTA_API_URL = "https://api-v3.mbta.com/routes";

// Get MBTA routes with optional filtering
router.get('/mbta-routes', async (req, res) => {
    try {
        const { type, id } = req.query; // Extract filters from query parameters

        let url = MBTA_API_URL;

        // Add filtering conditions if query parameters are provided
        const params = [];
        if (type) params.push(`filter[type]=${type}`);
        if (id) params.push(`filter[id]=${id}`);

        if (params.length > 0) {
            url += `?${params.join('&')}`;
        }

        const response = await axios.get(url, {
            headers: {
                'x-api-key': process.env.MBTA_API_KEY,
            },
        });

        res.json(response.data);
    } catch (error) {
        console.error("Error fetching MBTA data:", error);
        res.status(500).json({ error: "Failed to retrieve MBTA data" });
    }
});

module.exports = router;

