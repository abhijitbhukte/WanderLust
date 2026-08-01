const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync.js");
const  { isLoggedIn } = require("../middleware.js");
const {isOwner} = require("../middleware.js");
const {validateListing} = require("../middleware.js");
const listingController = require("../Controllers/listings.js");


// index route
router.get("/", wrapAsync(listingController.index));


// new Route
router.get("/new",isLoggedIn, wrapAsync(listingController.renderNewForm));


//add route
router.post("/",isLoggedIn, wrapAsync(listingController.addListing));


// Show route
router.get("/:id", wrapAsync(listingController.showListing));


// edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));


// update route
router.put("/:id", isLoggedIn,isOwner, validateListing, wrapAsync(listingController.updateListing));


// delete route
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.deleteListing));



module.exports = router;