const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    username: String,
    email: String,
    bio: String,
    profilePic: String,
    isAuthor: Boolean
})

module.exports = mongoose.model("User", UserSchema)
