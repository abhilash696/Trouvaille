const Review = require("../models/Review.js");
const Listing = require("../models/Listing.js");
module.exports.addReview = async(req,res)=>{
	let {id} = req.params;
	const listing = await Listing.findById(id);
	let review = new Review(req.body.review);
	review.author = req.user._id;
	listing.reviews.push(review);
	await review.save();
	await listing.save();
	req.flash("success","Thanks for the review!");
	res.redirect(`/listing/show/${listing._id}`);

};

module.exports.deleteReview  = async(req,res)=>{
	let{id,reviewId}=req.params;
	let listing=await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
	await Review.findByIdAndDelete(reviewId);
	req.flash("success","review deleted succesfully!");
	res.redirect(`/listing/show/${listing._id}`);
};