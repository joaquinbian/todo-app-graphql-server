import bcrypt from "bcryptjs";
import { getToken } from "../services/token.js";
import ObjectID from "bson-objectid";
import { AuthenticationError } from "apollo-server";

export const resolvers = {
  Query: {
    getTaskList: async (_, __, context) => {
      const { user, db } = context;
      if (!user) throw new Error("Authentication error: please sign in");
      console.log({ user });
      const taskList = await db
        .collection("TaskList")
        .find({ users: user._id.toString() })
        .toArray(); //para pasarlo a array
      // console.log({ taskList });

      if (taskList.length === 0) return null;
      return taskList;
    },
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
          token: getToken(user),
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
          token: getToken(user),
        },
      };
    },
    createTaskList: async (_, args, context) => {
      const { title } = args;
      const { db, user } = context;
      if (!user) {
        return {
          code: 400,
          success: false,
          message: "Can not create TaskList, please sign in",
          taskList: null,
        };
      }
      if (!title) {
        return {
          code: 400,
          success: false,
          message: "Must provide a title",
          taskList: null,
        };
      }

      const newTaskList = {
        title,
        createdAt: new Date().toISOString(),
        users: [user._id.toString()],
      };

      const result = await db.collection("TaskList").insertOne(newTaskList);
      const taskList = await db
        .collection("TaskList")
        .findOne({ _id: result.insertedId });

      return {
        code: 200,
        success: true,
        message: "TaskList created",
        taskList,
      };
    },
    updateTaskList: async (_, args, context) => {
      const { id, title } = args;
      const { db, user } = context;

      if (!user) {
        return {
          code: 400,
          success: false,
          message: "Authentication error, please sign in",
          taskList: null,
        };
      }

      if (!title || !id) {
        return {
          code: 400,
          success: false,
          message: "Not enough data! You must provide id and title!",
          taskList: null,
        };
      }

      const taskListUpdated = await db.collection("TaskList").findOneAndUpdate(
        { _id: ObjectID(id) },
        { $set: { title } }, //si ponemos directamente {title} reemplaza todo el documento
        { returnDocument: "after" } //lo retorna despues de ser actualizado
      );
      // console.log({ taskListUpdated });
      //aca  hacer una queryque te busque la tarea por el id, que ya lo tenemos
      //pero buscar si hay una mejor forma

      return {
        code: 200,
        success: true,
        message: "TaskList updaeted",
        taskList: taskListUpdated.value,
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
  TaskList: {
    id: (parent) => {
      const { _id, id } = parent;
      // console.log({ parent }, "parent en taskList id");
      return _id || id;
    },
    progress: () => 0,

    users: async (parent, _, context) => {
      const { db } = context;
      // console.log({ parent });
      //como no podemos usar un async dentro de un map, ponemos
      //todo dentro de un promiseAll, que recibe un array de promesas
      //y devuelve un array con sus rtas en caso de que se completen
      //devuelve un array de users
      const users = await Promise.all(
        parent.users.map((userId) =>
          db.collection("Users").findOne({ _id: ObjectID(userId) })
        )
      );
      return users;
    },
  },
};
