const Listing = require("../models/listing");
const Review = require("../models/review.js");
const expressError = require("../utils/expressError.js");

module.exports.createReview = async(req, res) => {
    // console.log("Params:", req.params);
    // console.log("Body:", req.body);
    // console.log("Review:", req.body.review);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    console.log(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
}


module.exports.deleteReview = async(req, res) => {
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review deleted!");
    res.redirect(`/listings/${id}`);
}