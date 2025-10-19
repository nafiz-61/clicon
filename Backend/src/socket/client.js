const { io } = require("socket.io-client");

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  query: { id: "123" },
});

// client-side connection
socket.on("connect", () => {
  console.log("Connected to server with ID: ", socket.id);
});

socket.on("cart", (data) => {
  console.log("from server", data);
});

// disconnection from server
socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

// error
socket.on("error", (error) => {
  console.log("Socket encountered error: ", error);
});
