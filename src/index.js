import { gql, ApolloServer } from "apollo-server";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const mocks = {
  Query: () => ({
    books: () => [...new Array(6)],
  }),
  Book: () => ({
    title: "Harry Potter",
    author: "Harry Maguire",
  }),
};

const typeDefs = gql`
  type Book {
    title: String!
    author: String!
  }

  type Query {
    books: [Book]
  }
`;

const startApi = async () => {
  try {
    const client = new MongoClient(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await client.connect();

    const db = client.db(process.env.DB_NAME);

    const server = new ApolloServer({ typeDefs, mocks });
    server.listen().then(({ url }) => {
      console.log(`server listen at ${url}`);
    });
  } catch (error) {
    console.log({ error });
  }
};

startApi();
