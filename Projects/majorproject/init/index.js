const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(MONGO_URL);
}

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj, ind) => {
    if (ind % 2 == 0) {
      return { ...obj, owner: "668f955a4b80391e8b88e904" };
    }
    return { ...obj, owner: "66914c492099ed2434d792da" };
  });
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
