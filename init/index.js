// storing data in database

const mongoose = require("mongoose");

const Listing = require("../models/listing")// requiring model Listing

const initData = require("./data")

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')
}

main()
    .then(() => {
        console.log("connected to db");
    })
    .catch(err => console.log(err));

const initDB = async () => {
    await Listing.deleteMany({});// to delete the data we insert ourselves
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "6875394e9385bedc74af2f25" }));// the data we get from data.js as initData.data is an array of objects and we apply map method on that to add owner property to each object of array 
    await Listing.insertMany(initData.data);
    console.log("data was initialised");

}

initDB();