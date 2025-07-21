const express = require("express");

const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");

const ExpressError = require("../utils/ExpressError");

const { listingSchema } = require("../schema");

const { isLoggedin, redirectUrl, isOwner, injectImageToBody } = require("../utils/middleware.js");

const listingController = require("../Controllers/listings.js");

const multer = require('multer')// requiring multer package

const { storage } = require("../cloudConfig.js");

const upload = multer({ storage });// now our form files are saved on cloudinary storage

// Schema Validation of listing  using Joi in the form of a function

let validateSchema = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);// Joi validation for listing schema

    console.log(error);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");// all the error details are separated from comma 
        console.log(errMsg);
        throw new ExpressError(400, errMsg);// if there is error in Joi then we throw error which is catched by error handling middleware
    } else {
        next();
    }
}

//New Route with controller

router.get("/new", isLoggedin, listingController.renderNewForm);

// search Box route

router.get("/search", wrapAsync(listingController.searchbox));

// Index and Create Route with router.route()

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedin, validateSchema, upload.single("listing[image]"), wrapAsync(listingController.createNewListing));

// Show ,Update,Delete Route with router.route

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedin, isOwner, validateSchema, upload.single("listing[image]"), wrapAsync(listingController.updateListing))
    .delete(isLoggedin, isOwner, wrapAsync(listingController.deleteListing));


//Edit route with Controller

router.get("/:id/edit", isLoggedin, isOwner, wrapAsync(listingController.editListing));

module.exports = router;