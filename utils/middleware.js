const Listing = require("../models/listing");

const Review = require("../models/review");

let isLoggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;// if a user is not logged in then only we want to to store the originalUrl inside req.session 
        req.flash("error", "You must be logged in !");
        return res.redirect("/login");
    }
    next();
}

// we store req.session.redirectUrl inside res.locals 

let redirectUrl = (req, res, next) => {
    res.locals.redirectUrl = req.session.redirectUrl;
    next();
}

//Authorization for listings middleware

let isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.currentUser._id)) {
        req.flash("error", "You are not the owner of this listing !")
        return res.redirect(`/listings/${id}`);// after return statement all the next statements are not executed
    }
    next();
}

//Authorization for reviews middleware
let isAuthor = async (req, res, next) => {
    let { id, review_id } = req.params;
    let review = await Review.findById(review_id);
    if (!review.author._id.equals(res.locals.currentUser._id)) {
        req.flash("error", "You are not the author of this review !")
        return res.redirect(`/listings/${id}`);// after return statement all the next statements are not executed
    }
    next();
}

module.exports = { isLoggedin, redirectUrl, isOwner, isAuthor };