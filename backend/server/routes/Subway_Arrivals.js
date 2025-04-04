const express = require('express');
const router = express.Router();
const axios = require('axios');

// GET /api/arrivals/:stationId?direction=0|1
router.get('/:stationId', async (req, res) => {
  const { stationId } = req.params;
  const { direction } = req.query;

  try {
    let url = `https://api-v3.mbta.com/predictions?filter[stop]=${stationId}&sort=arrival_time`;

    if (direction === '0' || direction === '1') {
      url += `&filter[direction_id]=${direction}`;
    }

    const { data } = await axios.get(url);

    const arrivals = data.data
      .filter(prediction => prediction.attributes.arrival_time)
      .map(prediction => {
        const arrivalTime = new Date(prediction.attributes.arrival_time);
        const now = new Date();
        const minutes = Math.round((arrivalTime - now) / 60000);

        return {
          time: minutes <= 0 ? 'Arriving' : `${minutes} min`,
          status: prediction.attributes.status || 'Scheduled'
        };
      })
      .slice(0, 5); // Limit to next 5 arrivals

    res.json(arrivals);
  } catch (err) {
    console.error('Error fetching arrivals:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch arrival predictions' });
  }
});

module.exports = router;
