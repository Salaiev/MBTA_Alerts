const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true 
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
  city: { 
    type: String, 
    required: true 
  },
  preferredRoute: { 
    type: String 
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true,
  collection: "users"
});

module.exports = mongoose.model('userModel', userSchema);
