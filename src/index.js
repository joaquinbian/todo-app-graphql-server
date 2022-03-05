import { gql, ApolloServer } from "apollo-server";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { resolvers } from "./graphql/resolvers.js";
import { typeDefs } from "./graphql/schema.js";

dotenv.config();

// const resolvers = {
//   Query: {
//     getTaskList: () => null,
//   },
// };

const startApi = async () => {
  try {
    const client = new MongoClient(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await client.connect();

    const db = client.db(process.env.DB_NAME);

    const context = {
      db,
    };

    //en el context le pasamos la db, el context es el 3 parametro de los resolvers
    //por eso desde los resolvers podemos acceeder a la bd
    const server = new ApolloServer({ typeDefs, context, resolvers });
    server.listen().then(({ url }) => {
      console.log(`server listen at ${url}`);
    });
  } catch (error) {
    console.log({ error });
  }
};

startApi();
