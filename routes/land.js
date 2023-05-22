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

router.post("/addLand", ensureAuthenticated, async (req, res) => {
    const { land } = req.body;
    const email = req.user.email;
    try {
        let user = await User.findOne({
            email: email
        })
        if(user.land[land]) {
            res.redirect("/home")
            return
        }
        user = await User.findOneAndUpdate(
            { email: email },
            { $set: { [`land.${land}`]: null } },
        );
        res.redirect("/home");
    } catch (error) {
        console.error(error);
        res.render("error");
    }
})


router.post("/deleteLand", ensureAuthenticated, async (req, res) => {
    try {
        const {land} = req.body
        const email = req.user.email
        const deletedTimers = await Timer.deleteMany({
            land: land,
            userEmail: email
        })
        const deletedLand = await User.updateOne(
            {email: email},
            {$unset: {[`land.${land}`]: 1}}
        )
        res.redirect("/home")
    } catch(err) {
        res.render("error", err)
    }

})

module.exports = router