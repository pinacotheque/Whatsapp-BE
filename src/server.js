import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser"
import { errorMiddlewares } from "./errorMiddlewares.js"

const server = express();
const port = process.env.PORT || 3004

// ****************** MIDDLEWARES ****************************

server.use(express.json());
server.use(cors())
server.use(cookieParser())

// ****************** ROUTES *******************************



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