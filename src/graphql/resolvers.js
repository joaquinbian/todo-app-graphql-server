export const resolvers = {
  Query: {
    getTaskList: () => null,
  },
  Mutation: {
    signUp: (_, args) => {
      console.log({ args });
    },
  },
};
