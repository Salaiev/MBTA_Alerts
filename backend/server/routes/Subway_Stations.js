const express = require('express');
const router = express.Router();
const axios = require('axios');

// GET /api/stations/:lineId
router.get('/:lineId', async (req, res) => {
  const { lineId } = req.params;

  try {
    const url = `https://api-v3.mbta.com/stops?filter[route]=${lineId}`;
    const { data } = await axios.get(url);

    const stations = data.data.map(stop => ({
      id: stop.id,
      name: stop.attributes.name
    }));

    res.json(stations);
  } catch (err) {
    console.error('Error fetching stations:', err.message);
    res.status(500).json({ error: 'Failed to fetch stations' });
  }
});

module.exports = router;
