// record the number of unique blog readers
const mongoose = require("mongoose")
const Schema = mongoose.Schema

const BlogReadersSchema = new Schema({
    blogId: String,
    userId: String
})

module.exports = mongoose.model('BlogReaders', BlogReadersSchema)
