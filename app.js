const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");
const session = require("express-session");
const flash = require("connect-flash");



const listings = require("./routers/listing.js");
const reviews = require("./routers/review.js");



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


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.use("/listings",listings);
app.use("/listings/:id/reviews", reviews);


async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderLust");
}

main().then(() => {
    console.log("connected successfully")
}).catch((err) => {
    console.log(err);
});



app.get("/", (req, res) => {
    res.send("Hi, I am WanderLust");
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