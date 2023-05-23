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

router.get("/land", ensureAuthenticated, async (req, res) => {
    const email = req.user.email

    const user = await User.findOne({email: email})
    if(user.wallet) {
        walletID = user.wallet
        res.render("land", {walletID})
        return
    }

    res.render("/link")
})

router.post("/land", ensureAuthenticated, (req, res) => {
    console.log(req.body)
})

router.get("/token", ensureAuthenticated, async (req, res) => {
    const email = req.user.email

    const user = await User.findOne({email: email})
    if(user.wallet) {
        walletID = user.wallet
        res.render("token", {walletID})
        return
    }

    res.render("/link")
})

router.get("/link", ensureAuthenticated, async (req, res) => {
    const email = req.user.email

    const user = await User.findOne({email: email})
    if(user.wallet) {
        walletID = user.wallet
        res.render("link", {walletID})
        return
    }
    res.render("link")
})

router.post("/link", ensureAuthenticated, async (req, res) => {
    const email = req.user.email
    const walletID = req.body.walletID
    await User.updateOne(
        {email: email},
        {$set: {wallet: walletID}}    
    ).catch(err => {
        res.render("error", {err})
    })
    res.redirect("link")
})
module.exports = router