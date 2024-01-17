const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/wrapasync.js");
const { isLoggedIn, isOwner,validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const { isObjectIdOrHexString } = require("mongoose");
const upload = multer({ storage });



router
  .route("/")
  .get(wrapasync(listingController.index))
  .post(isLoggedIn, 
    upload.single("listing[image]") ,wrapasync(listingController.createForm));

//new rout
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapasync(listingController.showForm))
  .put(
    isLoggedIn,
    isOwner,upload.single("listing[image]") ,
    validateListing,
    wrapasync(listingController.updateForm)
  )
  .delete(isLoggedIn,listingController.deleteForm);

//edit form
router.get("/:id/edit",isLoggedIn,isOwner, listingController.editForm);

module.exports = router;
