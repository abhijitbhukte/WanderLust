const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");




const listings = require("./routers/listing.js");
const reviews = require("./routers/review.js");



app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));


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