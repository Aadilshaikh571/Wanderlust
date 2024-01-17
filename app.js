if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expresserr.js");
const reviews = require("./routes/reviews.js");
const listings = require("./routes/listing.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const flash = require("connect-flash");
const wrapasync = require("./utils/wrapasync.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLESTDB_URL;
main()
  .then(() => {
    console.log("connection success with the db");
  })
  .catch((err) => {
    console.log(err);
  });
// thingss
async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRAT,
  },
  touchAfter: 24 * 3600,
});

//sessions option cookies
const sessionOptions = {
  store,
  secret:  process.env.SECRAT,
  saveUninitialized: true,
  resave: false,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: +7 * 24 * 60 * 60 * 1000,
  },
};

// app.get("/", (req, res) => {
//   res.send("hii im the root point");
// });

app.use(session(sessionOptions));
app.use(flash());

//passwords
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  //  console.log(req.user);

  next();
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", userRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError(500, "Something went wronge "));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wronge" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(8000, () => {
  console.log("app is listening at port 8000");
});
