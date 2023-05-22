const express = require('express')
const router =  express.Router()
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

router.post("/addHouse", ensureAuthenticated, async (req, res) => {
    const { house, land } = req.body;
    const email = req.user.email;
  
    try {
      const updatedUser = await User.findOneAndUpdate(
        { email: email },
        { $set: { [`land.${land}`]: house } },
        { new: true }
      );
  
      console.log("User updated:", updatedUser);
      res.redirect("/home");
    } catch (error) {
      console.error("Error updating user:", error);
      res.render("error");
    }
})

router.post("/deleteHouse", ensureAuthenticated, async (req, res) => {
    try {
        const {land, house} = req.body
        const email = req.user.email
        const deletedTimers = await Timer.deleteMany({
            land: land,
            userEmail: email,
            house: house
        })
        const deletedHouse = await User.findOneAndUpdate(
            {email: email},
            {$set: {[`land.${land}`]: null}},
            {new: true}
        )
        res.redirect("/home")
    } catch(err) {
        res.render("error", err)
    }
})

router.post("/updateHouse", ensureAuthenticated, async (req, res) => {
    try {
        const currentTime = Date.now()
        const {land, house, duration} = req.body
        const email = req.user.email
        await Timer.updateMany(
            {userEmail: email, land: land, house: house},
            {$set: {startTime: currentTime, endTime: currentTime + duration * 60 * 1000}}
        )
        res.redirect("/home")
    } catch(err) {
        res.render('error', err)
    }
})

module.exports = router