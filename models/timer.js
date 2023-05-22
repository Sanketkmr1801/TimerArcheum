const mongoose = require("mongoose");

const timerSchema = new mongoose.Schema({
  house: String,
  bench: Number,
  duration: Number,
  startTime: Number,
  endTime: Number,
  userEmail: String,
  land: String,
});

const Timer = mongoose.model("Timer", timerSchema);

module.exports = Timer;