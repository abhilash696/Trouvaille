const User = require("../models/User.js");

module.exports.signinview = (req,res)=>{
	res.render("signin.ejs");
}

module.exports.loginview = (req,res)=>{
	res.render("login.ejs");
}

module.exports.signin = async(req,res)=>{
	try{
		let {username,email,password} = req.body;
		const newUser = new User({email,username});
		const regUser = await User.register(newUser,password);
		req.flash("success","sign in succesfull!");
		req.login(regUser,(err)=>{
		if(err){
			return next(err);
		}
		else{
			req.flash("success","Welcome to trouvaille!");
			res.redirect("/listing");
		}
	})
	}
	catch(err){
		req.flash("error",err.message);
		res.redirect("/user/signin");
	}
}


module.exports.login =  (req,res)=>{
	req.flash("success","welcome to trouvaille");
	if(res.locals.redirectUrl){
		res.redirect(res.locals.redirectUrl);
	}
	else{
		res.redirect("/listing");
	}
}

module.exports.logout = (req,res)=>{
	req.logout((err)=>{
		if(err){
			return next(err);
		}
		else{
			req.flash("success","you are logged out!");
			res.redirect("/listing");
		}
	})
}