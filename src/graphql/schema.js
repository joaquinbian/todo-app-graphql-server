import { gql } from "apollo-server";
export const typeDefs = gql`
  type Query {
    getTaskList: [TaskList]
    getTaskListById(id: ID!): TaskList
  }

  type Mutation {
    signUp(input: SignUpInput!): AuthResult!
    signIn(input: SignInInput!): AuthResult!
    createTaskList(title: String!): CUDTaskListResponse!
    updateTaskList(id: ID!, title: String!): CUDTaskListResponse!
    deleteTaskList(id: ID!): CUDTaskListResponse!
    inviteUserToTaskList(
      taskListId: ID!
      userInvitedId: ID!
    ): CUDTaskListResponse!

    createToDo(content: String!, taskListId: ID!): ToDoResponse!
    updateToDo(id: ID!, content: String, isCompleted: Boolean): ToDoResponse!
    deleteToDo(id: ID!): ToDoResponse!
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

  "Create Update Delete TaskList Responses"
  type CUDTaskListResponse {
    code: Int!
    success: Boolean!
    message: String!
    taskList: TaskList
  }

  type ToDoResponse {
    code: Int!
    success: Boolean!
    message: String!
    toDo: ToDo
  }

  type AuthUser {
    user: User!
    token: String!
  }
  type AuthError {
    message: String!
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

  union AuthResult = AuthUser | AuthError
`;
