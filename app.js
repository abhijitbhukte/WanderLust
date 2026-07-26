const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");
const session = require("express-session");
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
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));


const sessionOption = {
    secret: "WanderLust",
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
    res.locals.currUser = req.user;
    next();
});

app.use("/",userRouter);
app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);

// app.get("/demouser", async (req, res) => {
//     let fakeUser = new User({
//         email: "abhijitbhukte@gmail.com",
//         username: "Abhijit1234",
//     });
//     let registeruser = await User.register(fakeUser, "Abhijit@1234");
//     console.log(registeruser);
//     res.send(registeruser);
// });


async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderLust");
}

main().then(() => {
    console.log("connected successfully")
}).catch((err) => {
    console.log(err);
});




app.use((req, res, next) => {
    next(new expressError(404, "Page Not Found!"));
});

// error handling middleware
app.use((err, req, res, next) => {
    let {status = 500, message = "Something wents Worng"} = err;
    res.status(status).render("./listings/error.ejs", {err});
    // res.status(status).send(message);
});

app.listen(8080, () => {
    console.log("App listening on a port 8080");
});