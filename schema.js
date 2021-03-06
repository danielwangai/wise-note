// define graphql schema here
const graphql = require("graphql")

// import models
const User = require("./models/user")
const Blog = require("./models/blog")
const BlogReaders = require("./models/blogReaders")
const BlogVote = require("./models/blogVote")

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
        isAuthor: { type: GraphQLBoolean },
        userAuthoredBlogs: {
            type: new GraphQLList(BlogType),
            resolve(parent) {
                return Blog.find({authorId: parent.id})
            }
        },
        userReads: {
            type: new GraphQLList(BlogReadersType),
            resolve(parent) {
                return BlogReaders.find({userId: parent.id})
            }
        }
    })
})

const BlogType = new GraphQLObjectType({
    name: "Blog",
    fields: () => ({
        id: {type: GraphQLID },
        title: {type: GraphQLString },
        content: {type: GraphQLString },
        author: {
            type: UserType,
            resolve(parent) {
                return User.findById(parent.authorId)
            }
        }
    })
})

const BlogReadersType = new GraphQLObjectType({
    name: "BlogReadersType",
    fields: () => ({
        id: {type: GraphQLID },
        blog: {
            type: BlogType,
            resolve(parent) {
                return Blog.findById(parent.blogId)
            }
        },
        user: {
            type: UserType,
            resolve(parent) {
                return User.findById(parent.userId)
            }
        }
    })
})

const BlogVoteType = new GraphQLObjectType({
    name: "BlogVote",
    fields: () => ({
        id: {type: GraphQLID },
        blog: {
            type: BlogType,
            resolve(parent) {
                return Blog.findById(parent.blogId)
            }
        },
        user: {
            type: UserType,
            resolve(parent) {
                return User.findById(parent.userId)
            }
        }
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
        },
        // get blog by id
        blog: {
            type: BlogType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Blog.findById(args.id)
            }
        },
        // get all blogs
        blogs: {
            type: new GraphQLList(BlogType),
            resolve() {
                return Blog.find({})
            }
        },
        blogReaders: {
            type: new GraphQLList(BlogReadersType),
            args: {
                blogId: { type: GraphQLID }
            },
            resolve(parent, args) {
                return BlogReaders.find({ blogId: args.blogId })
            }
        },
        getAllBlogVotes: {
            type: new GraphQLList(BlogVoteType),
            args: {
                blogId: { type: GraphQLID }
            },
            resolve(parent, args) {
                return BlogVote.find({ blogId: args.blogId })
            }
        },
        getAllBlogUpVotes: {
            type: new GraphQLList(BlogVoteType),
            args: {
                blogId: { type: GraphQLID }
            },
            resolve(parent, args) {
                return BlogVote.find({ blogId: args.blogId, vote: "upvote" })
            }
        },
        getAllBlogDownVotes: {
            type: new GraphQLList(BlogVoteType),
            args: {
                blogId: { type: GraphQLID }
            },
            resolve(parent, args) {
                return BlogVote.find({ blogId: args.blogId, vote: "downvote" })
            }
        },
        getUserUpVotedBlogs: {
            type: new GraphQLList(BlogVoteType),
            args: {
                userId: { type: GraphQLID }
            },
            resolve(parent, args) {
                return BlogVote.find({ userId: args.userId, vote: "upvote" })
            }
        },
        getUserDownVotedBlogs: {
            type: new GraphQLList(BlogVoteType),
            args: {
                userId: { type: GraphQLID }
            },
            resolve(parent, args) {
                return BlogVote.find({ userId: args.userId, vote: "downvote" })
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
        },
        updateBlog: {
            type: BlogType,
            args: {
                id: { type: GraphQLID },
                title: { type: GraphQLString },
                content: { type: GraphQLString }
            },
            resolve(parent, args) {
                return Blog.findByIdAndUpdate(
                    args.id,
                    { $set: { title: args.title, content: args.content }}
                )
                .catch(function(err) {
                    return new Error(err)
                })
            }
        },
        deleteBlog: {
            type: BlogType,
            args: {
                id: { type: GraphQLID },
            },
            resolve(parent, args) {
                const removedBlog = Blog.findByIdAndRemove(args.id).exec()
                if(!removedBlog) {
                    throw new Error('Error. Blog not found.')
                }
            }
        },
        addBlogReader: {
            type: BlogReadersType,
            args: {
                blogId: { type: GraphQLID },
                userId: { type: GraphQLID }
            },
            resolve(parent, args) {
                // check of blogId and userId exists - on individual collections
                // check if user-read exists
                let newUserRead = new BlogReaders()
                return BlogReaders.find({ blogId: args.blogId, userId: args.userId })
                    .then(function(br) {
                        if(!br.length) {
                            newUserRead.blogId = args.blogId
                            newUserRead.userId = args.userId
                            return newUserRead.save()
                        } else{
                            console.log("Already exists ", br)
                        }
                    })
            }
        },
        makeVote: {
            type: BlogVoteType,
            args: {
                blogId: { type: GraphQLID },
                userId: { type: GraphQLID },
                vote: { type: GraphQLString }
            },
            resolve(parent, args) {
                let newVote = new BlogVote()
                return BlogVote.find({ blogId: args.blogId, userId: args.userId })
                    .then(function(vote) {
                        const validChoices = ["upvote", "downvote"]
                        if(!vote.length) {
                            // validate vote
                            if(args.vote.length  && validChoices.includes(args.vote)) {
                                console.log("VOTE", vote)
                                newVote.blogId = args.blogId
                                newVote.userId = args.userId
                                newVote.vote = args.vote
                                return newVote.save()
                            }
                            console.log('Invalid vote')
                            return
                        }
                        // update vote
                        console.log("UPDATE ", vote)
                        if(!args.vote.length  || !validChoices.includes(args.vote)) {
                            console.log("Vote can either be upvote or downvote ", vote[0]._id)
                            return
                        }
                        return BlogVote.findByIdAndUpdate(
                            vote[0]._id,
                            { $set: { vote: args.vote }}
                        )
                    })
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
