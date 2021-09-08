import express from "express"
import cors from "cors"
import listEndpoints from "express-list-endpoints";
import cookieParser from "cookie-parser"
import { errorMiddlewares } from "./errorMiddlewares.js"
import usersRouter from "./services/users/users.js";
import messagesRouter from "./services/messages/messages.js";
import authRouter from "./services/auth.js";
import roomsRouter from "./services/rooms/rooms.js";

const app = express();
const whitelist = [process.env.FRONTEND_URL, process.env.FRONTEND_PROD_URL]

// ****************** MIDDLEWARES ****************************

app.use(express.json());
app.use(cookieParser())
app.use(
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

app.use("/users", usersRouter)
app.use("/messages", messagesRouter)
app.use("/rooms", roomsRouter)
app.use("/auth", authRouter)

// ****************** ERROR HANDLERS ***********************

app.use([errorMiddlewares])

console.table(listEndpoints(app));

export default app

