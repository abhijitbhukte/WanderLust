const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");
const session = require("express-session");
const { MongoStore } = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user.js");

const listingsRouter = require("./routers/listing.js");
const reviewsRouter = require("./routers/review.js");
const userRouter = require("./routers/user.js");

app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl: process.env.ATLASDB_URL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("Error in mongo session store", err);
});

const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user || null;
    next();
});

app.use("/", userRouter);
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);

async function main() {
    try {
        await mongoose.connect(process.env.ATLASDB_URL);
        console.log("✅ MongoDB Atlas connected successfully");
    } catch (err) {
        console.log("❌ MongoDB Atlas connection failed", err);
    }
}

main();



app.use((req, res, next) => {
    next(new expressError(404, "Page Not Found!"));
});

// error handling middleware
app.use((err, req, res, next) => {
    let { status = 500, message = "Something wents Worng" } = err;
    res.status(status).render("./listings/error.ejs", { err });
    // res.status(status).send(message);
});

app.listen(8080, () => {
    console.log("App listening on a port 8080");
});