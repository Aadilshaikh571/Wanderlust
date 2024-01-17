const Listing = require("./models/listing.js");
const ExpressError = require("./utils/expresserr.js");
const {listingSchema,reviewSchema} = require("./schema.js");

module.exports.isLoggedIn =(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","please log in ");
       return res.redirect("/login");
      }
      
      next();
};

module.exports.saveRedirectUrl =(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req,res,next)=>{
  let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currentUser._id)){
        req.flash("error","you dont have permission to edit");
        res.redirect(`/listings/${id}`);
      }
      next();
}

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
  
    if (error) {
      let errMsg = error.details[0].message;
      return next(new ExpressError(400, errMsg));
    } else {
      next();
    }
  };

  module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
  
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      return next(new ExpressError(400, errMsg));
    } else {
      next();
    }
  };