const mongoose = require("mongoose");

const feedbackPostSchema = new mongoose.Schema({

    username:{
        type: String,
        default: '',
    },

    comment:{
        type: String,
        default: '',
    },

    postDate: {
        type: Date, 
        default: Date.now,
    },

    Station: {
        Type: String,
    },

},
{ collection: "feedbackPost" }
);

module.exports = mongoose.model("feedbackPost", feedbackPostSchema);