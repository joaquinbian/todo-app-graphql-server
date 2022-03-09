import { gql } from "apollo-server";
export const typeDefs = gql`
  type Query {
    getTaskList: [TaskList]
    getTaskListById(id: ID!): TaskList
  }

  type Mutation {
    signUp(input: SignUpInput!): SignUserResponse!
    signIn(input: SignInInput!): SignUserResponse!
    createTaskList(title: String!): CUTaskListResponse!
    updateTaskList(id: ID!, title: String!): CUTaskListResponse!
    deleteTaskList(id: ID!): DeleteTaskListResponse!
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
  type SignUserResponse {
    code: Int!
    success: Boolean!
    message: String!
    user: AuthUser
  }

  "Create Update TaskList Responses"
  type CUTaskListResponse {
    code: Int!
    success: Boolean!
    message: String!
    taskList: TaskList
  }

  type DeleteTaskListResponse {
    code: Int!
    success: Boolean!
    message: String!
    taskList: TaskList
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
