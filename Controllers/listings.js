const Listing = require("../models/listing");
const { config, geocoding } = require("@maptiler/client");
const mapToken = process.env.MAPTILER_API_KEY;
config.apiKey = mapToken;

// async function getCoordinates(place) {
//     try {
//         const response = await geocoding.forward(place);

//         const coordinates = response.features[0].geometry.coordinates;

//         console.log("Longitude:", coordinates[0]);
//         console.log("Latitude:", coordinates[1]);

//         return coordinates;
//     } catch (error) {
//         console.log("Geocoding Error:", error);
//     }
// }

// // Test
// getCoordinates("Nagpur, India");

module.exports.index =async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}


module.exports.renderNewForm = async (req, res) => {
    res.render("listings/new.ejs");
}


module.exports.addListing = async (req, res) => {
    // {title, description, image, price, location, country} = req.body;

    const geoResponse = await geocoding.forward(
         req.body.listing.location,
         {
            limit: 1
        }
    );

    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url, "...", filename);

    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};

    newListing.geometry = geoResponse.features[0].geometry;
    const savedListing = await newListing.save();
    console.log(savedListing);
    
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}


module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    // console.log(listing);
    if(!listing) {
        req.flash("error", "Listing You Requested For Are Deleted");
        return res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs", {listing});
}


module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing You Requested For Are Deleted");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("upload", "upload/w_250,h_250,c_fill");
    res.render("listings/edit.ejs", {listing, originalImageUrl});
}


module.exports.updateListing = async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);  
}


module.exports.deleteListing = async (req, res) => {
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
} 