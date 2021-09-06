import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser"
import { errorMiddlewares } from "./errorMiddlewares.js"
import usersRouter from "./services/users/users.js";
import messagesRouter from "./services/messages/messages.js";
import chatsRouter from "./services/chat/chats.js";

const server = express();
const port = process.env.PORT || 3004

// ****************** MIDDLEWARES ****************************

server.use(express.json());
server.use(cors())
server.use(cookieParser())

// ****************** ROUTES *******************************

server.use("/users", usersRouter)
server.use("/messages", messagesRouter)
server.use("/chats", chatsRouter)
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