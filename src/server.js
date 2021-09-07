import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser"
import { errorMiddlewares } from "./errorMiddlewares.js"
import usersRouter from "./services/users/users.js";
import messagesRouter from "./services/messages/messages.js";
import chatsRouter from "./services/chat/chats.js";
import authRouter from "./services/auth.js";

const server = express();
const port = process.env.PORT || 3004
const whitelist = [process.env.FRONTEND_URL, process.env.FRONTEND_PROD_URL]

// ****************** MIDDLEWARES ****************************

server.use(express.json());
server.use(cookieParser())
server.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error("Not allowed by cors!"))
      }
    },
    credentials: true,
  })
)

// ****************** ROUTES *******************************

server.use("/users", usersRouter)
server.use("/messages", messagesRouter)
server.use("/chats", chatsRouter)
server.use("/auth", authRouter)

// ****************** ERROR HANDLERS ***********************

server.use([errorMiddlewares])

console.table(listEndpoints(server));

mongoose
  .connect(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() =>
    server.listen(port, () => {
      console.log("🧡 server is running on port ", port);
    })
  )
  .catch((err) => console.log(err));