const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync.js");
const  { isLoggedIn } = require("../middleware.js");
const {isOwner} = require("../middleware.js");
const {validateListing} = require("../middleware.js");
const listingController = require("../Controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage: storage });



router.route("/")
    .get(wrapAsync(listingController.index)) // index route
    .post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.addListing)); // create route

// new Route
router.get("/new",isLoggedIn, wrapAsync(listingController.renderNewForm));


router.route("/:id")
    .get(wrapAsync(listingController.showListing))  // show route
    .put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))  // update route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));  // delete route

// edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));



module.exports = router;