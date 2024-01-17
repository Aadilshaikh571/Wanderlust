const review = require("../models/reviews.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newReview = new review(req.body.reviews);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    // console.log(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","new review inserted");
    res.redirect(`/listings/${listing._id}`);
  }
module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await review.findByIdAndDelete(reviewId);
    req.flash("success"," review deleted");
    res.redirect(`/listings/${id}`);
  }  