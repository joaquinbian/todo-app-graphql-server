import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import ObjectID from "bson-objectid";

dotenv.config();

export const getUser = async ({ token, db }) => {
  if (!token) return null;
  //tenemos el id del token, lo decodeamos
  const tokenId = jwt.verify(token, process.env.SECRET);
  //si no devuelve un id en el token, es pq algo salió mal
  if (!tokenId?.id) return null;
  const user = await db
    .collection("Users")
    .findOne({ _id: ObjectID(tokenId.id) });
  //   console.log({ user });
  return user;
};
