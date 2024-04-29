const express = require("express");
const Listing = require("../models/Listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {isLoggedin,isOwner} = require("../middleware.js");
const listingController=require("../controllers/listing.js");
const multer  = require('multer')
const {storage}=require("../cloudconfig.js");
const upload = multer({ storage })


const router = express.Router();


router
.get("/",wrapAsync(listingController.index))
.get("/filter/:filtername",wrapAsync(listingController.filterlisting))
.get("/show/:id",wrapAsync(listingController.showlisting))
.get("/addform",isLoggedin,listingController.addForm)
.post("/newlisting",isLoggedin,upload.single("image"),wrapAsync(listingController.newlisting))
.get("/:id/edit",isLoggedin,wrapAsync(listingController.editListing))
.put("/:id/update",isLoggedin,isOwner,upload.single("image"),wrapAsync(listingController.updateListing))
.get("/:id/delete",isLoggedin,isOwner,wrapAsync(listingController.deleteListing))
.post("/search",wrapAsync(listingController.searchlisting))

module.exports = router;