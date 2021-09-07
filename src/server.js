import { createServer } from "http"
import { Server } from "socket.io";
import { addUser, removeUser } from "./usersFunc.js";
import RoomModel from "./services/rooms/schema.js"
import app from "./app.js";

// ****************** Passing it to a Http Server *******************************

const server = createServer(app)

// Instantiating the io server using the http server. We can't pass the app here

const io = new Server(server, { 
    allowEIO3: true 
})

// ****************** EVENT LISTENERS *******************************

io.on("connection", socket => {
    console.log(socket.id);

    // ******* LOGIN *********

    socket.on("login", (userId, roomId) => {
        addUser(userId, socket.id, roomId)
        socket.join(roomId)
        socket.broadcast.emit("newLogin") //send to everyone except the client
        socket.emit("loggedin") //send only to client
    })

    // *** SEND MESSAGE ****

    socket.on("sendMessage", async (message, roomId) => {
        await RoomModel.findByIdAndUpdate(roomId,{
            $push:{
                chatHistory: message
            }
        })
        socket.to(roomId).emit("message", message)
    })

    // ******* DISCONNECT *********

    socket.on("disconnect", () => {
        console.log("socket disconnected");
        removeUser(socket.id)
    })
})

export default server