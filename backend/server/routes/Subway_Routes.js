const express = require('express');
const router = express.Router();
const axios = require('axios');

// GET /api/lines – Fetch subway routes only (Red, Orange, Blue, Green)
router.get('/', async (req, res) => {
  try {
    const url = 'https://api-v3.mbta.com/routes?filter[type]=0,1';
    const { data } = await axios.get(url);

    const subwayLines = data.data.map(route => ({
      id: route.id,
      name: route.attributes.long_name,
      color: route.attributes.color
    }));

    res.json(subwayLines);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch subway lines' });
  }
});

module.exports = router;
