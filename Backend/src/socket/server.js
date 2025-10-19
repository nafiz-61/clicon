let io = null;
const { Server } = require("socket.io");
const { customError } = require("../utils/customError");

module.exports = {
  initSocket: (hostServer) => {
    io = new Server(hostServer, {
      cors: {
        origin: "",
      },
    });

    // connection
    io.on("connection", (socket) => {
      const userId = socket.handshake.query.id;
      if (userId) {
        socket.join(userId);
      }
      // error
      socket.on("disconnect", () => {
        console.log("User disconnected");
      });
    });

    io.emit("order", {
      message: "order placed successfully",
      item: {},
    });

    io.on("error", (error) => {
      console.log("Socket encountered error: ", error);
      throw new customError(500, "Socket encountered error: " + error);
    });
  },
  getIo: () => {
    if (!io) {
      throw new customError(500, "Socket.io not initialized");
    }
    return io;
  },
};
