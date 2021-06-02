require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const http = require("http");
const socketIO = require("socket.io");

const Router = require("./src/routers/index");
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.raw());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use("/v1", Router);

const port = process.env.PORT;
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");
  io.emit("welcome", "welcome to socket");
});

server.listen(port, () => console.log(`Listening on port ${port}`));
