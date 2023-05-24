
express = require("express")
app = express()
const { urlencoded } = require("body-parser");
const bodyParser = require("body-parser");
const session = require('express-session');
const User = require("./models/user")
const Timer = require("./models/timer")

const mongoose = require("mongoose")


const homeRoutes = require('./routes/home');
const landRoutes = require('./routes/land');
const houseRoutes = require('./routes/house')
const timerRoutes = require('./routes/timer')
const walletRoutes = require("./routes/walletRoute")

houses = {
    "tent": ["basic"],
    "small": ["basic", "green"],
    "medium": ["basic", "green", "blue"],
    "large": ["basic", "green", "blue", "arcane"],
    "manor": ["basic", "green", "blue", "arcane", "heroic"]
}

benchColors = {
    "basic": "#707070",
    "green": "#5CBF9B",
    "blue": "#5499C7",
    "arcane": "#A569BD",
    "heroic": "#F9C74F",
    "intensifiedbasic": "#404040",
    "intensifiedgreen": "#46A681",
    "intensifiedblue": "#4688B2",
    "intensifiedarcane": "#853F7C",
    "intensifiedheroic": "#E1A82D"
  }

benchPriority = {
    "basic": 0,
    "green": 1,
    "blue": 2,
    "arcane": 3,
    "heroic": 4
}

resourceInput = {
    "basic": [130, 250, 500],
    "green": [500, 1000, 2020],
    "blue": [1000, 2000, 4000],
    "arcane": [1750, 3500, 6960],
    "heroic": [3160, 6320, 12640]
}

archeumTaxes = {
    10000: 600,
    5000: 400
}
mongoose.connect('mongodb://127.0.0.1:27017/ArcheumTimer', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error"))
db.once("open", () => {
    console.log("Database Connected")
})

app.use(
    session({
      secret: 'your-secret-key', // Add a secret key for session encryption
      resave: false,
      saveUninitialized: false,
    })
  );
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: "287732990107-f1kevvta7f40iqpugu7eos60kf8o4cqu.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: '/auth/google/callback' // Specify the callback URL for authentication success
}, (accessToken, refreshToken, profile, done) => {
    // Handle authentication success and user data
    // Save user to database or perform other actions
    // Call 'done' to indicate successful authentication
    const email = profile.emails[0].value;
    const name = profile.displayName;
    const user = {
      email,
      name,
      // You can include other relevant user information as needed
    };
    done(null, user);
}));
passport.serializeUser((user, done) => {
    // Serialize user data to store in the session
    done(null, user);
});

passport.deserializeUser((user, done) => {
    // Retrieve user data from the session and deserialize it
    done(null, user);
});

timeIntervals = [3, 6, 12]

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));

app.use("/", homeRoutes)
app.use("/", timerRoutes)
app.use("/", landRoutes)
app.use("/", houseRoutes)
app.use("/", walletRoutes)

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/home', // Redirect to a success page
    failureRedirect: '/login' // Redirect to a failure page
}));




app.listen("3000", (req, res) => {
    console.log("Server listening at port 3000")
})