const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

const MBTA_API_URL = "https://api-v3.mbta.com/routes";

// Get MBTA routes with valid filtering
router.get('/mbta-routes', async (req, res) => {
    try {
        console.log("Received Query Params:", req.query); // Debugging

        const { type, id, stop, direction_id } = req.query;

        let url = MBTA_API_URL;
        const params = [];

        if (type) params.push(`filter[type]=${type}`);
        if (id) params.push(`filter[id]=${id}`);
        if (stop) params.push(`filter[stop]=${stop}`);
        if (direction_id) params.push(`filter[direction_id]=${direction_id}`);

        if (params.length > 0) {
            url += `?${params.join('&')}`;
        }

        console.log("Final API Request URL:", url); // Debugging

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
