const express = require("express");
const socket = require("socket.io");

const app = express();

const server = app.listen(4000, () => {
  console.log("Server is running");
});

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connect", (socket) => {
  console.log("Socket connected:" + socket.id);
  let totalCln = io.of("/").sockets.size;
  io.sockets.emit("total", totalCln);

  socket.on("message", (message) => {
    io.sockets.emit("message", message);
  });
  socket.on("typing", (typer) => {
    socket.broadcast.emit("typing", typer.id);
  });
  socket.on("disconnect", () => {
    let totalCln = io.of("/").sockets.size;
    io.sockets.emit("total", totalCln);
  });
});
