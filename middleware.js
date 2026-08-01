const Listing = require("./models/listing.js");
const expressError = require("./utils/expressError.js");
const {listingSchema} = require("./schema.js");

const isLoggedIn = (req, res, next) => {
    console.log(req.user);
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in!");
        return res.redirect("/login");
    }
    next();
};


const saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;   
    }
    next();
};

const isOwner = async (req, res, next) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing.owner._id.equals(req.user._id)) {
        req.flash("error", "You are not authorized to perform this action!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

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


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        console.log(error.details);
        let errMsg = error.details.map(el => el.message).join(", ");
        throw new expressError(400, errMsg);
    }
    next();
};


module.exports = {isLoggedIn, saveRedirectUrl, isOwner, validateListing, validateReview};