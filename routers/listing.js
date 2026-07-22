const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const {listingSchema} = require("../schema.js");




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




// index route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}));


// new Route
router.get("/new", wrapAsync(async (req, res) => {
    res.render("listings/new.ejs");
}));


//add route
router.post("/", wrapAsync(async (req, res) => {
    // {title, description, image, price, location, country} = req.body;

    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));


// Show route
router.get("/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    console.log(listing);
    res.render("listings/show.ejs", {listing});
}));


// edit route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));


// update route
router.put("/:id",validateListing, wrapAsync(async (req, res, next) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);  
}));


// delete route
router.delete("/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings");
}));



module.exports = router;