const express = require('express')
const router =  express.Router()
const { urlencoded } = require("body-parser");
const bodyParser = require("body-parser");
const session = require('express-session');
const User = require("../models/user")
const Timer = require("../models/timer")
const mongoose = require("mongoose")


function ensureAuthenticated(req, res, next) {
    // if (req.isAuthenticated()) {
        return next();
    // }
    // res.redirect('/login');
}

router.get("/wallet", ensureAuthenticated, (req, res) => {
    const walletID = "0x6bf8a469c92999fda818a25d79960475a9ad942e"
    res.render("wallet", {walletID})
})

router.post("/wallet", ensureAuthenticated, (req, res) => {
    console.log(req.body)
})

router.get("/token", ensureAuthenticated, (req, res) => {
    const walletID = "0x6bf8a469c92999fda818a25d79960475a9ad942e"
    res.render("token", {walletID})
})

module.exports = router