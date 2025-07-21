const User = require("../models/user");

// Signup GET route of user

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
}

// Signup POST route of user

module.exports.signUp = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({
            username: username,
            email: email
        })
        let registeredUser = await User.register(newUser, password);// saving the user in database
        console.log(registeredUser);

        // using req.login to automatically login the user after sign up of a user
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust");
            res.redirect("/listings");
        })

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

// Render login form of user

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}

// login POST method user

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to WanderLust!");
    let redirectingUrl = res.locals.redirectUrl || "/listings";// if we are login through the login option in navabar then we store "/listings "in redirectingUrl otherwise if we are not using login option of navbar then we store res.locals,redirectUrl inside redirectingUrl

    res.redirect(redirectingUrl);
}

// Logout route of listing

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    })

}



