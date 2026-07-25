const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const {default: passportLocalMongoose} = require("passport-local-mongoose");

// console.log(passportLocalMongoose);
// console.log(typeof passportLocalMongoose);

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("user", userSchema);