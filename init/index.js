const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderLust");
}

main().then(() => {
     console.log("connected successfully")
}).catch((err) => {
    console.log(err);
});

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: '6a6cef7e5e8200d87101ea9e', // Replace with the actual user ID you want to set as the owner
    }));
    let Data = await Listing.insertMany(initData.data);
    console.log(Data);
};

initDB();