require("dotenv").config()
const express = require("express")
const graphqlHTTP = require("express-graphql")
const mongoose = require("mongoose")

// local imports
const schema = require("./schema")

const app = express()

const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_HOST = process.env.DB_HOST
const DB_PORT = process.env.DB_PORT
const DB_NAME = process.env.DB_NAME

const DB_URL = "mongodb://"+DB_USER+":"+DB_PASSWORD+"@"+DB_HOST+":"+DB_PORT+"/"+DB_NAME

// mongodb connection
mongoose.connect(DB_URL)
mongoose.connection.once("open", function() {
    console.log("Connected to database...")
})

app.use("/graphql", graphqlHTTP({
    schema,
    graphiql: true
}))

app.listen(4000, function() {
    console.log("Listening on port 4000")
})
