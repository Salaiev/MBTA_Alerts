const mongoose = require('mongoose');

const PreferredRouteSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true }, 
    routeId: { type: String, required: true }, 
    routeName: { type: String, required: true }, 
}, { timestamps: true });

module.exports = mongoose.model('PreferredRoute', PreferredRouteSchema);
