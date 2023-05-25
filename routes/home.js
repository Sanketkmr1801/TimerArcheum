const express = require('express')
const router =  express.Router()
const { urlencoded } = require("body-parser");
const bodyParser = require("body-parser");
const session = require('express-session');
const User = require("../models/user")
const Timer = require("../models/timer")
const mongoose = require("mongoose")

const produceInput = [500, 2020, 4000, 6960, 12640]

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

router.get("/login", (req, res) => {
    res.render("login")
})

router.get("/logout", (req, res) => {
    req.logout(function(err) {
      if (err) {
        // Handle error
        console.error(err);
        return res.redirect("/login"); // Redirect to an appropriate route
      }
      // Successful logout
      res.redirect("/login"); // Redirect to the desired page after logout
    });
  });

router.get("/home", ensureAuthenticated, async (req, res) => {
    try {
        let totalProduceDaily = 0
        console.log("FINDING TIMERS FOR THE EMAIL " + req.user.email);
        const isAddTimer = req.query.addTimer;
        const email = req.user.email;
        const timers = await Timer.find({ userEmail: req.user.email }).sort({bench: -1, duration: -1});
        let user = await User.findOne({email: email})
        // Arrange timers into an object
        if(!user) {
            newUser = new User({
                email: email
            })
            console.log("NEW USER ENTERING ", email)

            await newUser.save()

            user = newUser
            console.log(newUser)
        }
        const arrangedTimers = {};
        for(let land in user.land) {
            arrangedTimers[land] = {}
            if(user.land[land]) {
                arrangedTimers[land][user.land[land]] = []
            }
        }
        for (let timer of timers) {
            let land = timer["land"]
            let house = timer["house"];
            if(!arrangedTimers[land]) {
                arrangedTimers[land] = {}
            }
            if (!arrangedTimers[land][house]) {
                arrangedTimers[land][house] = [timer];
                totalProduceDaily += produceInput[timer.bench]
            } else {
                arrangedTimers[land][house].push(timer);
                totalProduceDaily += produceInput[timer.bench]
            }
        }
        const archeumToBsltRate = 0.006
        res.render("home", {
          houses,
          arrangedTimers,
          user: req.user,
          benchColors,
          isAddTimer,
          lands: user.land,
          benchPriority,
          totalProduceDaily,
          archeumToBsltRate,
          archeumTaxes
        });
      } catch (error) {
        console.error(error);
        res.render("error");
      }
})

module.exports = router