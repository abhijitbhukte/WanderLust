const express = require("express");
const router = express.Router({ mergeParams: true });
const {reviewSchema} = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const {isLoggedIn ,validateReview, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../Controllers/review.js");

// Create review route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));



// review delete route
router.delete("/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));


module.exports = router;
