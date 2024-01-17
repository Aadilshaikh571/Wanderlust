// this file refers to initialize data in the mongodb database in local host
const mongoose = require("mongoose");
const initdata = require("./data");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
  .then(() => {
    console.log("connection success with the db");
  })
  .catch((err) => {
    console.log(err);
});
async function main() {
  await mongoose.connect(MONGO_URL);
}

const initdb = async () => {
  await Listing.deleteMany({});
  initdata.data = initdata.data.map((obj) => ({
    ...obj,
    owner: "65a548532bda8d4666b90032"
  }));
  await Listing.insertMany(initdata.data);
  console.log("init data complete");
};
initdb();
