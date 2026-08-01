const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router({ mergeParams: true });
const User = require("../models/user");
const passport = require("passport");
const  {isLoggedIn } = require("../middleware/loggin.js");
const { saveRedirectUrl } = require("../middleware/loggin.js");

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});


router.post("/signup", wrapAsync(async(req, res) => {
    try{
        let {username, email, password} = req.body;
        console.log(username, email, password);
        const newUser = new User({username, email});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success", "Welcome to WenderLust");
            return res.redirect("/listings");
        });
    }catch(error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }   
}));


router.get("/login", (req, res)=> {
    res.render("users/login.ejs");
});

console.log(saveRedirectUrl);
router.post("/login", saveRedirectUrl, passport.authenticate("local",
    {
        failureRedirect: "/login",
        failureFlash: true
    }),
    async(req, res) => {
        req.flash("success", "Welcome Back TO WenderLust!");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    }
);



router.get("/logout", (req, res) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "Your Logged Out!");
        res.redirect("/listings");
    });
});

module.exports = router;