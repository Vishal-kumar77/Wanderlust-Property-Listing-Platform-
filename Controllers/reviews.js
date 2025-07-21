const Listing = require("../models/listing");

const Review = require("../models/review");


// Create route of review 

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    newReview.author = req.user._id;// adding author property to each review before creating it 

    console.log(newReview);

    listing.reviews.push(newReview);


    await newReview.save();
    await listing.save();

    // res.send("new review saved");
    req.flash("success", "New Review added !");
    res.redirect(`/listings/${listing._id}`);
}

// Delete Route of review 

module.exports.deleteReview = async (req, res) => {
    let { id, review_id } = req.params;
    // console.log(review_id);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: review_id } })// it pulls or remove the reviewid from reviews array of listing

    await Review.findByIdAndDelete(review_id);

    req.flash("success", "Review Deleted !");
    res.redirect(`/listings/${id}`);
}