import { ApolloServer, gql } from "apollo-server";
import  {
  ApolloServerPluginLandingPageLocalDefault
}  from "apollo-server-core";

let users =[
  {
  id: "1",
  username: "ryumyunghan",
  firstName: "myunghan",
  lastName: "ryu"
  },
  {
    id:"2",
    firstName: "elon",
    lastName: "mask"
  }
];

let tweets =[
  {
  id: "1",
  text: "first one",
  },
  {
    id: "2",
    text: "second one",
  }
];
const movies = [
  {
    title: "The Awakening",
    id: "1",
  },
  {
    title: "City of Glass",
    id: "2",
  },
  {
    title: "타이타닉",
    id: "3",
  },
  {
    title: "Mud",
    id: "4",
  },
  {
    title: "LaLa land",
    id: "5",
  },
  {
    title: "Whiplash",
    id: "6",
  },
];


// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  type User {
    username: String
    firstName: String!
    lastName: String!
    fullName:String!
    id: ID!
  }

  type Movie {
    title: String
    id: String
  }

  type Tweet{
    text: String!
    id:ID!
    author: User
  }

  type Query {
    allUsers:[User]
    allMovies: [ Movie ]
    allTweets: [ Tweet!]!
    tweet(id: ID!): Tweet
    ping:String!
  }

  type Mutation {
    postTweet(text:String!, userId:ID!) : Tweet!
    deleteTweet(id:ID!): Boolean!
  }
`;

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    allMovies: () => movies,
    allTweets: ()=> tweets,
    tweet(_, {id}){
      return tweets.find((tweet)=> tweet.id === id);
    },
    ping(){
      return "pong";
    },
    allUsers:() =>{
      console.log("allUsers console log");
      return users;
    },
  },Mutation:{
    postTweet(_, {text, userId}){
      const newTweet = {
        id: tweets.length + 1,
        text
      }

      tweets.push(newTweet);
      return newTweet;
    },
    deleteTweet(_, {id}){
    const tweet = tweets.find(tweet => tweet.id === id);
    if(!tweet) return false;
    tweets = tweets.filter(tweet => tweet.id !== id);
    return true;
    }
  },
  User:{
    fullName({firstName, lastName}){
      return `${firstName}${lastName}`;
    }
  }
};


// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  cache: "bounded",
  /**
   * What's up with this embed: true option?
   * These are our recommended settings for using AS;
   * they aren't the defaults in AS3 for backwards-compatibility reasons but
   * will be the defaults in AS4. For production environments, use
   * ApolloServerPluginLandingPageProductionDefault instead.
   **/
  plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
