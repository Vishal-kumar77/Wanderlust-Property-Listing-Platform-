const express = require("express");

const router = express.Router();

const User = require("../models/user.js");

const wrapAsync = require("../utils/wrapAsync.js");

const passport = require("passport");

const { redirectUrl } = require("../utils/middleware.js");

const userController = require("../Controllers/users.js");

// Signup get and post route with router.route()

router.route("/signup")
    .get(userController.renderSignupForm)// get signup route

    .post(wrapAsync(userController.signUp));// post signup route

// login get and post route with router.route()

router.route("/login")
    .get(userController.renderLoginForm)
    .post(redirectUrl, passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }), userController.login);

// Logout route with controller

router.get("/logout", userController.logout);

module.exports = router;