const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const mbtaRoutes = require('./routes/liveRoutes'); // Get routes
const updateRoutes = require('./routes/updateLiveRoutes'); // Update routes

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
//     .then(() => console.log("Connected to MongoDB"))
//     .catch(err => console.error("MongoDB connection error:", err));

// Routes
app.use('/routes', mbtaRoutes); // Handles GET requests
app.use('/routes', updateRoutes); // Handles PUT requests

const PORT = 8081;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
