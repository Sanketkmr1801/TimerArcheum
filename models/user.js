const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    land: {
        type: Object,
        default: {} // Set as an empty object
    },
    wallet: {
        type: String,
    },
    discordID: {
        type: String,
        default: null
    }
    // Other user data fields
});

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
