// define graphql schema here
const graphql = require("graphql")

// import models
const User = require("./models/user")

// graphql data types
const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLBoolean,
    GraphQLSchema
} = graphql

// define types
const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        bio: { type: GraphQLString },
        profilePic: { type: GraphQLString },
        isAuthor: { type: GraphQLBoolean }
    })
})

// root query
const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        user: {
            type: UserType,
            args: { id: {type: GraphQLID}},
            resolve(parent, args) {
                // fetch user by id
                return User.findById(args.id)
            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addUser: {
            type: UserType,
            args: {
                name: { type: GraphQLString },
                username: { type: GraphQLString },
                email: { type: GraphQLString },
                bio: { type: GraphQLString },
                profilePic: { type: GraphQLString },
                isAuthor: { type: GraphQLBoolean }
            },
            resolve(parent, args) {
                // create new user
                let user = new User({
                    name: args.name,
                    username: args.username,
                    email: args.email,
                    bio: args.bio,
                    profilePic: args.profilePic,
                    isAuthor: args.isAuthor
                })
                return user.save()
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
