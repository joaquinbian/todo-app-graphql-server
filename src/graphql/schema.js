import { gql } from "apollo-server";
export const typeDefs = gql`
  type Query {
    getTaskList: [TaskList]
  }

  type Mutation {
    signUp(input: SignUpInput!): SignUpResponse!
    signIn(input: SignInInput!): AuthUser!
  }

  "cuando tenemos muchos parametros para pasar, lo podemos hacer así para q sea mas legible"
  input SignUpInput {
    email: String!
    name: String!
    password: String!
    avatar: String
  }
  input SignInInput {
    email: String!
    password: String!
  }

  "type de la respuesta que devuelve cuando nos registramos"
  type SignUpResponse {
    code: Int!
    success: Boolean!
    message: String!
    user: AuthUser
  }

  type AuthUser {
    user: User!
    token: String!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    avatar: String
  }

  type TaskList {
    id: ID!
    title: String!
    createdAt: String!
    progress: Float!
    users: [User!]!
    toDos: [ToDo!]!
  }

  type ToDo {
    id: ID!
    content: String!
    isCompleted: Boolean!
    taskList: TaskList!
  }
`;
