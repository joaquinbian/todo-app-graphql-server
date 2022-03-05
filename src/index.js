import { gql, ApolloServer } from "apollo-server";

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

const server = new ApolloServer({ typeDefs, mocks });

server.listen().then(({ url }) => {
  console.log(`server listen at ${url}`);
});
