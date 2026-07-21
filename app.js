const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");
const listingSchema = require("./schema.js");
const reviewSchema = require("./schema.js");
const Review = require("./models/review.js");


app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));


async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderLust");
}

main().then(() => {
    console.log("connected successfully")
}).catch((err) => {
    console.log(err);
});


// validation middleware
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);

    if (error) {
        console.log(error.details);
        let errMsg = error.details.map(el => el.message).join(", ");
        throw new expressError(400, errMsg);
    }
    next();
};


const validateSchema = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        console.log(error.details);
        let errMsg = error.details.map(el => el.message).join(", ");
        throw new expressError(400, errMsg);
    }
    next();
};


// index route
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}));


// new Route
app.get("/listings/new", wrapAsync(async (req, res) => {
    res.render("listings/new.ejs");
}));


//add route
app.post("/listings",validateListing, wrapAsync(async (req, res) => {
    // {title, description, image, price, location, country} = req.body;

    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));


// Show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    console.log(listing);
    res.render("listings/show.ejs", {listing});
}));


// edit route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));


// update route
app.put("/listings/:id",validateListing, wrapAsync(async (req, res, next) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);  
}));


// delete route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings");
}));


// reviews
app.post("/listings/:id/reviews",validateSchema, wrapAsync(async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
}));

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