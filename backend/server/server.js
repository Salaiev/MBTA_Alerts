const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Route Imports
const subwayRoutes = require('./routes/Subway_Routes');
const subwayStations = require('./routes/Subway_Stations');
const subwayArrivals = require('./routes/Subway_Arrivals');
const userRoutes = require('./routes/User_Routes' );
const busStops = require('./routes/BusStops');
favoriteRoutes = require('./routes/favoriteRoutes');



const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log(" Connected to MongoDB"))
  .catch(err => console.error(" MongoDB error:", err));

// Routes
app.use('/api/bus-stops', busStops);
app.use('/api/lines', subwayRoutes);
app.use('/api/stations', subwayStations);
app.use('/api/arrivals', subwayArrivals);
app.use('/api/users', userRoutes); 
app.use('/api/favorite-routes', favoriteRoutes);

// Server Port
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
