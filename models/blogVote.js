const mongoose = require("mongoose")
const Schema = mongoose.Schema

const BlogVoteSchema = new Schema({
    blogId: String,
    userId: String,
    vote: String
})

module.exports = mongoose.model('BlogVote', BlogVoteSchema)
