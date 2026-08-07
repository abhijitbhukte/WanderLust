const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const { config, geocoding } = require("@maptiler/client");
require("dotenv").config({ path: "../.env" });

config.apiKey = process.env.MAPTILER_API_KEY;



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
     for (let obj of initData.data) {

        const geoResponse = await geocoding.forward(obj.location, {
            limit: 1,
        });

        obj.owner = "6a6cef7e5e8200d87101ea9e";

        obj.geometry = {
            type: "Point",
            coordinates: geoResponse.features[0].geometry.coordinates,
        };
    }
    let Data = await Listing.insertMany(initData.data);
    console.log(Data);
};

initDB();