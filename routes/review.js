const express = require("express");

const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync");

const ExpressError = require("../utils/ExpressError");

const { reviewSchema } = require("../schema");

const { isLoggedin, isAuthor } = require("../utils/middleware");// Loggedin middleware is used to check a user trying to create a review is logged in on the platform or not

const reviewController = require("../Controllers/reviews");

//Review Validation using Joi

let reviewValidateSchema = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);// Joi validation for review schema

    console.log(error);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");// all the error details are separated from comma 
        console.log(errMsg);
        throw new ExpressError(400, errMsg);// if there is error in Joi then we throw error which is catched by error handling middleware
    } else {
        next();
    }
}

// Create review route with controller

router.post("/", isLoggedin, reviewValidateSchema, wrapAsync(reviewController.createReview));

//Deletion review route with controller

router.delete("/:review_id", isLoggedin, isAuthor, wrapAsync(reviewController.deleteReview))

module.exports = router;