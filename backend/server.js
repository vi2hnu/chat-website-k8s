import express from "express";
import dotenv from "dotenv"
import connect from "./db/connect.js"
import auth from "./routes/auth.js";
import message from "./routes/message.js"
import cookieParser from "cookie-parser";
import user from "./routes/user.js";
import cors from "cors";
import { Server } from 'socket.io';
import { createServer } from "node:http";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";

const PORT = process.env.PORT
const app = express()
const server = createServer(app);

//redis
const redisUrl = "redis://localhost:6379";
const pubClient = createClient({ url: redisUrl });
const subClient = pubClient.duplicate();
const redisClient = createClient({ url: redisUrl });

await Promise.all([
  pubClient.connect(),
  subClient.connect(),
  redisClient.connect()
]);

export const io = new Server(server, {
  path: "/socket.io",
  cors: {
    origin: "https://chat-app.com",
    credentials: true,
  },
});
io.adapter(createAdapter(pubClient, subClient));


//middleware
app.use(express.json()); 
app.use(cookieParser());
app.use(cors({ origin: ["http://chat-app.com"], credentials: true }));

app.use("/api/auth",auth);
app.use("/api/messages",message);
app.use("/api/users",user)

//socket io
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    redisClient.set(`user:${userId}`, socket.id);
  }

  redisClient.keys("user:*").then((keys) => {
    const userIds = keys.map((key) => key.split(":")[1]);
    io.emit("online users", userIds);
  });

  socket.on("disconnect", async () => {
    if (userId) {
      await redisClient.del(`user:${userId}`);
      const keys = await redisClient.keys("user:*");
      const userIds = keys.map((key) => key.split(":")[1]);
      io.emit("online users", userIds);
    }
  });
});

// export for controller usage
export async function getReceiverSocketId(userId) {
  return await redisClient.get(`user:${userId}`);
}


//server
server.listen(PORT,()=> {
    connect();
    console.log(`server is running at ${PORT}`);
    
})