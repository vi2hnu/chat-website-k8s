import express from "express";
import dotenv from "dotenv"
import connect from "./db/connect.js"
import auth from "./routes/auth.js";
import message from "./routes/message.js"
import cookieParser from "cookie-parser";
import user from "./routes/user.js";
import cors from "cors";
import { Server } from 'socket.io';
import { createServer } from 'node:http';

//config
dotenv.config();

const PORT = process.env.PORT
const app = express()
const server = createServer(app);
export const io = new Server(server);


//middleware
app.use(express.json()); 
app.use(cookieParser());
app.use(cors({ origin: ["http://localhost:3000","http://192.168.29.117:3000"], credentials: true }));

app.use("/api/auth",auth);
app.use("/api/messages",message);
app.use("/api/users",user)

//socket io
const userSocketMap = {}; 

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;

    io.emit("online users ", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
})

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}


//server
server.listen(PORT,()=> {
    connect();
    console.log(`server is running at ${PORT}`);
    
})