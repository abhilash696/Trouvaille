const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/User.js");
const passport = require("passport");
const {saveUrl,isLoggedin} = require("../middleware.js");
const userController=require("../controllers/user.js");

const router = express.Router();

router
.get("/signin",userController.signinview)
.get("/login",userController.loginview)
.post("/signin",userController.signin)
.post("/login",saveUrl,passport.authenticate("local",{failureRedirect:"/user/login",failureFlash:true}),userController.login)
.get("/logout",userController.logout)

module.exports = router;