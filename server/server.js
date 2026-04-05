const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST"],
  },
});

// roomId -> [{ name, peopleId, socketId }]
const rooms = {};

app.get("/health", (req, res) => res.json({ status: "ok" }));

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("joinRoom", ({ roomId, name }) => {
    socket.join(roomId);

    if (!rooms[roomId]) rooms[roomId] = [];

    // Remove stale entry for same name (reconnect case)
    rooms[roomId] = rooms[roomId].filter((m) => m.name !== name);

    const peopleId = (rooms[roomId].length % 4) + 1;
    rooms[roomId].push({ name, peopleId, socketId: socket.id });

    // Broadcast updated member list to everyone in the room
    io.to(roomId).emit("updateRoom", rooms[roomId]);
    console.log(`${name} joined room ${roomId}. Members: ${rooms[roomId].length}`);
  });

  socket.on("codeChange", ({ roomId, code }) => {
    // Broadcast to everyone else in the room
    socket.to(roomId).emit("codeUpdate", code);
  });

  socket.on("languageChange", ({ roomId, language }) => {
    socket.to(roomId).emit("languageUpdate", language);
  });

  socket.on("userTyping", ({ roomId, name }) => {
    socket.to(roomId).emit("userTyping", { name });
  });

  socket.on("userStoppedTyping", ({ roomId, name }) => {
    socket.to(roomId).emit("userStoppedTyping", { name });
  });

  socket.on("leaveRoom", (roomId) => {
    handleLeave(socket, roomId);
  });

  socket.on("disconnect", () => {
    // Remove user from all rooms they were in
    for (const roomId in rooms) {
      const before = rooms[roomId].length;
      rooms[roomId] = rooms[roomId].filter((m) => m.socketId !== socket.id);
      if (rooms[roomId].length !== before) {
        io.to(roomId).emit("updateRoom", rooms[roomId]);
        // Clean up empty rooms
        if (rooms[roomId].length === 0) delete rooms[roomId];
      }
    }
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

function handleLeave(socket, roomId) {
  socket.leave(roomId);
  if (rooms[roomId]) {
    rooms[roomId] = rooms[roomId].filter((m) => m.socketId !== socket.id);
    io.to(roomId).emit("updateRoom", rooms[roomId]);
    if (rooms[roomId].length === 0) delete rooms[roomId];
  }
}

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`XOR Socket server running on port ${PORT}`);
});
