const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  email: {
    type: String
  },
  land: String,
  isNotifyableDiscord: {
    type: Number,
    default: 1
  },
  isNotifyableWeb: {
    type: Number,
    default: 1
  }
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;