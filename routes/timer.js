const express = require('express');
const router = express.Router();
const { urlencoded } = require("body-parser");
const bodyParser = require("body-parser");
const session = require('express-session');
const User = require("../models/user")
const Timer = require("../models/timer")
const mongoose = require("mongoose")


function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

router.post("/addTimer", ensureAuthenticated, async (req, res) => {
    const {bench, resource, house, land} = req.body
    console.log(req.body, "PRINTING SOMETHING HERE")
    let duration = timeIntervals[resource]
    console.log(`House Type: ${house}`)
    console.log(`Bench Type: ${bench}`)
    console.log(`Timer Duration: ${duration}\n`)

    let startTime = Date.now()
    let endTime = startTime + duration * 60 * 1000
    // Get the user's email from the authenticated user
    const userEmail = req.user.email;
    
    let user = await User.findOne({email: userEmail})
    let existingLands = user["land"]
    if(existingLands[land] !== house) {
        res.redirect("/home?addTimer=1");
        return
    }
    const newTimer = new Timer({
        house,
        bench: benchPriority[bench],
        duration,
        startTime,
        endTime,
        userEmail, // Add the user's email to the timer object
        land
    });

    try {
        const savedTimer = await newTimer.save();
        console.log('New timer added:', savedTimer);
      } catch (error) {
        console.error('Error adding timer:', error);
      }

      if(req.body.isAddTimer == 1) res.redirect("/home?addTimer=1")
      else res.redirect("/home")
})

router.post("/deleteTimer", ensureAuthenticated, async (req, res) => {
    const timerID = req.body.timerID;

    await Timer.findByIdAndRemove(timerID)
    res.redirect('/home');
})

router.post("/updateTimer", ensureAuthenticated, (req, res) => {
    const { timerID, duration } = req.body
    Timer.updateOne(
        {_id: timerID},
        {$set: {startTime: Date.now(), endTime: Date.now() + duration * 60 * 1000}}
    ).catch(err => {
        console.log(err)
        res.render("error")
    })
    res.redirect("/home")
})

module.exports = router