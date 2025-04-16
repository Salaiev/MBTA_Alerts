const express = require('express');
const router = express.Router();
const axios = require('axios');

// GET /api/bus-stops/:routeId
router.get('/:routeId', async (req, res) => {
  const routeId = req.params.routeId;

  if (!routeId) {
    return res.status(400).json({ error: 'Route ID is required' });
  }

  try {
    const result = await axios.get('https://api-v3.mbta.com/stops', {
      params: {
        'filter[route]': routeId,
        'page[limit]': 200, 
      }
    });

    const stops = result.data.data.map(stop => ({
      id: stop.id,
      name: stop.attributes.name
    }));

    res.json(stops);
  } catch (err) {
    console.error('Failed to fetch bus stops:', err.message);
    res.status(500).json({ error: 'Failed to fetch bus stops' });
  }
});

module.exports = router;
