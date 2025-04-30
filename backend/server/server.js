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
const busArrivals = require('./routes/BusArrival');
const favoriteRoutes = require('./routes/favoriteRoutes');
const createPost = require('./routes/feedback/createPost');
const deletePost = require('./routes/feedback/deletePost');
const updatePost = require('./routes/feedback/updatePost');
const getPost = require('./routes/feedback/getPost');




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
app.use('/api/bus-arrivals', busArrivals);
app.use('/api/bus-stops', busStops);
app.use('/api/lines', subwayRoutes);
app.use('/api/stations', subwayStations);
app.use('/api/arrivals', subwayArrivals);
app.use('/api/users', userRoutes); 
app.use('/api/favorite-routes', favoriteRoutes);
app.use('/api/feedback/createPost', createPost);
app.use('/api/feedback/deletePost', deletePost);
app.use('/api/feedback/updatePost', updatePost);
app.use('/api/feedback/getPost', getPost);


// Server Port
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
