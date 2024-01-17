const express = require("express");
const router = express.Router({ mergeParams: true });
const ExpressError = require("../utils/expresserr.js");
const wrapasync = require("../utils/wrapasync.js");
const Listing = require("../models/listing.js");
const reviewController = require("../controllers/reviews.js");
const {validateReview,isLoggedIn} = require("../middleware.js");


//reviews post route
router.post("/",isLoggedIn,validateReview, wrapasync(reviewController.createReview));

// reviews delete post
router.delete("/:reviewId",wrapasync(reviewController.deleteReview));

module.exports = router;
