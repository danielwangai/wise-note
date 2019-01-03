// define graphql schema here
const graphql = require("graphql")

// import models
const User = require("./models/user")
const Blog = require("./models/blog")

// graphql data types
const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLBoolean,
    GraphQLSchema,
    GraphQLList
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

const BlogType = new GraphQLObjectType({
    name: "Blog",
    fields: () => ({
        id: {type: GraphQLID },
        title: {type: GraphQLString },
        content: {type: GraphQLString },
        authorId: {type: GraphQLID }
    })
})

// root query
const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        // get single user
        user: {
            type: UserType,
            args: { id: {type: GraphQLID}},
            resolve(parent, args) {
                // fetch user by id
                return User.findById(args.id)
            }
        },
        // get all users who are authors
        authors: {
            type: new GraphQLList(UserType),
            resolve() {
                return User.find({isAuthor: true})
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve() {
                return User.find({})
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
        },
        deleteUser: {
            type: UserType,
            args: {id: { type: GraphQLID }},
            resolve(parent, args) {
                return User.findByIdAndRemove(args.id)
            }
        },
        createBlog: {
            type: BlogType,
            args: {
                title: { type: GraphQLString },
                content: { type: GraphQLString },
                authorId: { type: GraphQLID }
            },
            resolve(parent, args) {
                let blog = new Blog({
                    title: args.title,
                    content: args.content,
                    authorId: args.authorId
                })
                return blog.save()
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
