const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router({ mergeParams: true });
const User = require("../models/user");
const passport = require("passport");
const  {isLoggedIn } = require("../middleware.js");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../Controllers/user.js");


router.route("/signup")
    .get(userController.renderSignupForm) // signup form route
    .post(wrapAsync(userController.signup)); // signup route


router.route("/login")
    .get(userController.renderLoginForm) // login form route
    .post(saveRedirectUrl, passport.authenticate("local",
        {
            failureRedirect: "/login",
            failureFlash: true
        }),
    userController.login // login route
);



router.route("/logout")
    .get(userController.logout); // logout route

module.exports = router;