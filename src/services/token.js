import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

//creamos el token, con el verify method podemos decodearlo
//lo hacemos con _id pq es el de la bd
export const getToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.SECRET, {
    expiresIn: "7 days",
  });
};
