const mongoose =  require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./Review.js");

const listingSchema = new Schema({
	title:{
		type:String,
		required:true
	},
	description:{
		type:String,
		required:true
	},
	image:{
		filename:String,
		url:String,
		},
	location:{
		type:String,
		required:true
	},
	price:{
		type:String,
		required:true
	},
	country:{
		type:String,
		required:true
	},
	reviews:[
	{
		type:Schema.Types.ObjectId,
		ref:"Review",
	}],
	owner:{
		type:Schema.Types.ObjectId,
		ref:"User"
	},
	category:{
		type:String,
		enum:["Tropical","Mountain","Lakes","Arctic","Farm","Historic","Camping","Pool"]
	}
},
);

listingSchema.post("findOneAndDelete",async(listing)=>{

	await Review.deleteMany({_id:{$in:listing.reviews}});


})

const Listing = mongoose.model("Listing",listingSchema);




module.exports= Listing;