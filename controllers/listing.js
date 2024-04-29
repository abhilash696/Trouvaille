const Listing = require("../models/Listing.js");


module.exports.index = async(req,res,next)=>{
	const listings = await Listing.find();
	res.render("index.ejs",{listings});
}

module.exports.showlisting = async(req,res,next)=>{
	let {id} = req.params;
	const listing = await Listing.findById(id).populate('owner').populate({path:"reviews",populate:{path:"author"}});
	if(!listing){
		req.flash("error","No listing with requested data!");
		res.redirect("/listing");
	}
	else{
	res.render("show.ejs",{listing});
	}
}

module.exports.addForm = (req,res)=>{
	res.render("new.ejs");
}

module.exports.editListing = async(req,res,next)=>{
	let {id} = req.params;
	const listing = await Listing.findById(id);
	if(!listing){
		req.flash("error","Listing not found!");
		res.redirect("/listing");
	}
	res.render("update.ejs",{listing});

};

module.exports.newlisting  = async(req,res)=>{
	let {title,description,price,country,location,category} = req.body;
	let url=req.file.path;
	let filename = req.file.filename;

	const listing = new Listing({title,description,price,country,location,category});

	listing.owner = req.user._id;
	listing.image = {url,filename};
	await listing.save();
	req.flash("success","New listing added succesfully!");
	res.redirect("/listing");
}

module.exports.updateListing = async(req,res,next)=>{
	let {id} = req.params;
	let {title,description,price,country,location} = req.body;
	let listing = await Listing.findByIdAndUpdate(id,{title,description,price,country,location});
	if(req.file){
		let url=req.file.path;
		let filename = req.file.filename;
		listing.image = {url,filename};
		await listing.save();
	}
	req.flash("success","Listing updated!");
	res.redirect(`/listing/show/${id}`);

};

module.exports.deleteListing = async(req,res,next)=>{
	let {id} = req.params;
	const listing = await Listing.findByIdAndDelete(id);
	req.flash("success","Listing deleted!")
	res.redirect("/listing");

};

module.exports.filterlisting = async(req,res,next)=>{
	let filter = req.params.filtername;
	let listings = await Listing.find({category:filter}).populate('owner').populate({path:"reviews",populate:{path:"author"}});
	if(listings.length<1){
		req.flash("error","No listing with requested data!");
		res.redirect("/listing");
	}
	else{
	res.render("index.ejs",{listings});
	}
}

module.exports.searchlisting = async(req,res,next)=>{
	let listing_name = req.body.title;
	const all_listings = await Listing.find()
	titles=[]
	for(listing of all_listings){
		titles.push(listing.title);
	}
	res_list = titles.filter((title)=>{
		let title_list = title.toLowerCase().split(' ');
		if (title_list.includes(listing_name.toLowerCase())){
			return title
	}
})
	let listings = await Listing.find({title:{$in:res_list}}).populate('owner').populate({path:"reviews",populate:{path:"author"}});
	if(listings.length<1){
		req.flash("error","No listing with requested data!");
		res.redirect("/listing");
	}
	else{
	res.render("index.ejs",{listings});
	}

}