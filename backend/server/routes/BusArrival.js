const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/:stopId', async (req, res) => {
  const stopId = req.params.stopId;

  if (!stopId) {
    return res.status(400).json({ error: 'Stop ID is required' });
  }

  try {
    const result = await axios.get('https://api-v3.mbta.com/predictions', {
      params: {
        'filter[stop]': stopId,
        'filter[route_type]': 3,
        'sort': 'departure_time',
        'include': 'route',
      }
    });

    const arrivals = result.data.data
      .filter(pred => pred.attributes.departure_time || pred.attributes.arrival_time)
      .map(pred => {
        const time = pred.attributes.departure_time || pred.attributes.arrival_time;
        const arrivalDate = new Date(time);
        const minutesAway = Math.round((arrivalDate - new Date()) / 60000);
        return {
          time: minutesAway <= 0 ? 'Arriving' : `${minutesAway} min`,
          status: pred.attributes.status || 'Scheduled',
        };
      });

    res.json(arrivals.slice(0, 5));
  } catch (error) {
    console.error('Bus arrival fetch failed:', error.message);
    res.status(500).json({ error: 'Failed to fetch bus arrivals' });
  }
});

module.exports = router;
