const Listing = require("./models/Listing.js");
const Review = require("./models/Review.js");

module.exports.isLoggedin = (req,res,next)=>{
	if(!req.isAuthenticated()){
		req.session.redirectUrl = req.originalUrl;
		req.flash("error","You are not logged in");
		return res.redirect("/user/login");
	}
	next();
}

module.exports.saveUrl = (req,res,next)=>{
	if(req.session.redirectUrl){
		res.locals.redirectUrl = req.session.redirectUrl;
	}
	next();
}


module.exports.isOwner = async(req,res,next)=>{
	let {id} = req.params;
	let listing = await Listing.findById(id);
	if(!listing.owner.equals(res.locals.registeredUser._id)){
		req.flash("error","You are not authorized to do this");
		return res.redirect(`/listing/show/${id}`);
	}
	next();
}

module.exports.isAuthor = async(req,res,next)=>{
	let {id,reviewId} = req.params;
	let review = await Review.findById(reviewId);
	if(!review.author.equals(res.locals.registeredUser._id)){
		req.flash("error","You are not author of this comment");
		return res.redirect(`/listing/show/${id}`);
	}
	next();
}