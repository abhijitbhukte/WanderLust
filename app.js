const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderLust");
}

main().then(() => {
     console.log("connected successfully")
}).catch((err) => {
    console.log(err);
});


app.get("/testListing", async (req, res) => {
    let sampleList = new Listing({
        title: "Vitalda Serenity Villa A",
        discription:"Upto 10 Guests, 4 Bedrooms, 5 Bathrooms, 1 Pool",
        price: 31000,
        location: "Moira, Goa",
        country: "India",
    });
    await sampleList.save();
    console.log(sampleList);
    res.send("Working Successfully");
});


app.get("/", (req, res) => {
    res.send("Hi, I am WanderLust");
});


app.listen(8080, () => {
    console.log("App listening on a port 8080");
});