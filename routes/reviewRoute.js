const express = require("express");
const Listing = require("../models/Listing.js");
const Review = require("../models/Review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {isLoggedin,isAuthor}  =require("../middleware.js");
const reviewController=require("../controllers/review.js");

const router = express.Router({mergeParams:true});

router
.post("/addreview",isLoggedin,wrapAsync(reviewController.addReview))
.delete("/:reviewId",isLoggedin,isAuthor,wrapAsync(reviewController.deleteReview))

module.exports = router;