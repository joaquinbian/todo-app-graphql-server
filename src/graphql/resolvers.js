import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";

export const resolvers = {
  Query: {
    getTaskList: () => null,
  },
  Mutation: {
    signUp: async (_, args, context) => {
      const { input } = args;
      const { db } = context;
      const hashedPassword = bcrypt.hashSync(input.password);
      const newUser = {
        ...input,
        password: hashedPassword,
      };

      const userExist = await db
        .collection("Users")
        .findOne({ email: input.email });

      if (userExist) {
        return {
          code: 400,
          success: false,
          message: "user already exist",
          user: null,
        };
      }

      const result = await db.collection("Users").insertOne(newUser);
      const user = await db
        .collection("Users")
        .findOne({ _id: result.insertedId });

      return {
        code: 200,
        success: true,
        message: "user created!",
        user: {
          user,
          token: "a el token 8)",
        },
      };
    },
    signIn: async (_, args, context) => {
      const { input } = args;
      const { db } = context;

      const user = await db.collection("Users").findOne({ email: input.email });
      if (!user) {
        return {
          code: 400,
          success: false,
          message: "invalid credentials",
          user: null,
        };
      }

      //le pasamos la contraseña del login y la de la bd hasheada
      const isPasswordCorrect = bcrypt.compareSync(
        input.password,
        user.password
      );
      if (!isPasswordCorrect) {
        return {
          code: 400,
          success: false,
          message: "invalid credentials",
          user: null,
        };
      }
      return {
        code: 200,
        success: true,
        message: "user logged!",
        user: {
          user,
          token: "a el token 8)",
        },
      };
    },
  },
  User: {
    id: (parent) => {
      //como en la base de datos el id esta en _id, lo devolvemos asi
      //para que matchee con el shcema,
      const { _id, id } = parent;
      //hacemos esto porque aveces el id viene directamente de la app
      //y en ese caso no está como _id
      return _id || id;
    },
  },
};
