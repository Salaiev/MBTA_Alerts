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
const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your frontend's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
};

const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json()); // Middleware to parse JSON bodies
// MongoDB Connection
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB error:", err));


// Routes
app.use('/api/bus-arrivals', busArrivals);
app.use('/api/bus-stops', busStops);
app.use('/api/lines', subwayRoutes);
app.use('/api/stations', subwayStations);
app.use('/api/arrivals', subwayArrivals);
app.use('/api/users', userRoutes); 
app.use('/api/favorite-routes', favoriteRoutes);

app.use('/api/feedback/create', createPost);    // POST: /api/feedback/create
app.use('/api/feedback', getPost);               // GET: /api/feedback
app.use('/api/feedback/delete', deletePost);    // DELETE: /api/feedback/:id
app.use('/api/feedback/update', updatePost);    // PUT: /api/feedback/:id


// Server Port
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
