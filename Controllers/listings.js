const Listing = require("../models/listing");

//Index Route of listing

module.exports.index = async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

//Search box route

module.exports.searchbox = async (req, res) => {
    let { country } = req.query;

    // if search box is empty
    if (!country) {
        req.flash("error", "Please enter a location to search .");
        return res.redirect("/listings");
    }

    const regex = new RegExp(country, "i"); //case-insensitive match

    const allListings = await Listing.find({
        $or: [
            { country: { $regex: regex } },// if country provided by user is matched with the searched country
            { location: { $regex: regex } },//  or if location provided by user is matched with the searched country
        ]
    });

    // if the searched listing doesn't exist
    if (allListings.length === 0) {
        req.flash("error", `No listings found for "${country}".`);
        return res.redirect("/listings");
    }

    // console.log(allListings)
    res.render("listings/searchbox.ejs", { allListings, country });
}

//New Route of listing

module.exports.renderNewForm = (req, res) => {
    console.log(req.user);
    res.render("listings/new.ejs");
}

// Create Route of listing 

module.exports.createNewListing = async (req, res, next) => {
    let url = req.file.path;// url of image 
    let filename = req.file.filename;// filename of image 

    let newListings = new Listing(req.body.listing);

    newListings.image = { url, filename };// storing url and filename inside image field of listings 

    newListings.owner = req.user._id;// we are storing curent user id to the owner property of newListings

    await newListings.save();
    req.flash("success", "New Listing created !");
    res.redirect("/listings");
}

//Show Route of listing

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).
        populate({
            path: "reviews",
            populate: { path: "author" },
        })
        .populate("owner");
    console.log(listing);
    if (!listing) {
        req.flash("error", "Listing you are looking for doesn't exist .");
        res.redirect("/listings");
    }
    else {
        res.render("listings/show.ejs", { listing });
    }
}

//Edit route of listing

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    // the below condition is for flashing error message
    if (!listing) {
        req.flash("error", "Listing you are looking for doesn't exist .");
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;

    let resizedOriginalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");

    res.render("listings/edit.ejs", { listing, resizedOriginalImageUrl });

}

// Update route of listing

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    console.log(req.file);
    if (!req.body.listing) {
        throw new ExpressError(404, "Page not Found");
    }
    let updated = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    // we apply condition that if image is provided by user inside edit form then only we add url and filename to updatedlisting  .image 

    if (typeof req.file !== "undefined") {
        let url = req.file.path;// url of image 
        let filename = req.file.filename;// filename of image 

        updated.image = { url, filename };

    }
    await updated.save();

    req.flash("success", " Listing Updated !");
    res.redirect(`/listings/${id}`);

}

// Delete Route of listing

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", " Listing Deleted !");
    res.redirect("/listings");
}
