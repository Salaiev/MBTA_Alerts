const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();


const MBTA_API_URL = "https://api-v3.mbta.com/routes";


router.get('/mbta-routes', async (req, res) => {
    try {
        const response = await axios.get(MBTA_API_URL, {
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
