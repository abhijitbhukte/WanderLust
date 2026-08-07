const User = require("../models/user");


module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
}



module.exports.signup = async(req, res) => {
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
}


module.exports.renderLoginForm =  (req, res)=> {
    res.render("users/login.ejs");
}


module.exports.login = async(req, res) => {
    req.flash("success", "Welcome Back to WenderLust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}


module.exports.logout = (req, res) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "Your Logged Out!");
        res.redirect("/listings");
    });
}
