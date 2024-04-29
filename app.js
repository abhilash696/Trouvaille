if(process.env.NODE_ENV != "production"){
	require('dotenv').config();
}
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const listingRouter = require("./routes/listingRoute.js");
const reviewRouter = require("./routes/reviewRoute.js");
const userRouter = require("./routes/userRoute.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const ExpressError = require("./utils/ExpressError.js");
const User = require("./models/User.js");
const port = 8080;

const app = express();

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.join(__dirname,"/public")));
app.use(methodOverride('_method'));
app.engine("ejs",ejsmate);

const store = MongoStore.create({ 
	mongoUrl: process.env.MONGODBURL,
	crypto:{
		secret:process.env.SECRET
	},
	touchAfter:24*3600 
 });


const sessionOptions = {
	secret :process.env.SECRET,
	store,
	resave:false,
	saveUninitialized:true,
	cookie : {
		expires: Date.now()+7*24*60*60*1000,
		maxAge:7*24*60*60*1000,
		httpOnly:true
	}

};


main()
.then(()=>{
	console.log("connection succefull")
})
.catch((err)=>{
	console.log(err);
});

async function main() {
await mongoose.connect(process.env.MONGODBURL);
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());	

app.use((req,res,next)=>{
	console.log(req.session)
	console.log(req.cookies)
	
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	res.locals.registeredUser = req.user;
	next();
});


app.use("/listing",listingRouter);
app.use("/listing/:id/review",reviewRouter);
app.use("/user",userRouter);



app.all("*",(req,res,next)=>{
	next(new ExpressError(404,"Page not found"));
});

app.use((err,req,res,next)=>{
	let {statusCode=500,message="something went wrong"} = err;
	res.status(statusCode).render("error.ejs",{message});
});

app.listen(port,()=>{console.log("app running on port",port)});