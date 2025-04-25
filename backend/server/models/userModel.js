const mongoose = require('mongoose');

const favoriteRouteSchema = new mongoose.Schema({
  fromStation: { type: String, required: true },
  toStation: { type: String, required: true },
  routeName: { type: String,required: true}
}, { _id: true }); 

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  lastname: { 
    type: String, 
    required: true 
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true,
    minlength: 8
  },
  favoriteRoutes: [favoriteRouteSchema]
}, { 
  timestamps: true,
  collection: "users"
});

module.exports = mongoose.model('User', userSchema);
