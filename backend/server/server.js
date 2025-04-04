const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import route files with updated names
const subwayRoutes = require('./routes/Subway_Routes');
const subwayStations = require('./routes/Subway_Stations');
const subwayArrivals = require('./routes/Subway_Arrivals');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/lines', subwayRoutes);
app.use('/api/stations', subwayStations);
app.use('/api/arrivals', subwayArrivals);

// Server port
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// MongoDB Connection
// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
// MongoDB Connection
// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
//     .then(() => console.log("Connected to MongoDB"))
//     .catch(err => console.error("MongoDB connection error:", err));