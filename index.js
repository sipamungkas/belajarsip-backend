require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const http = require("http");
const { socketConnection, sendNotification } = require("./src/services/socket");

const Router = require("./src/routers/index");
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.raw());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use("/v1", Router);
app.get("/notifications", async (req, res) => {
  sendNotification(
    "notification:18",
    "John doe has been registered to your class"
  );
  res.send("ok");
});

const port = process.env.PORT;
const server = http.createServer(app);
const socketOptions = {
  cors: {
    origin: "http://localhost:3000",
  },
};
socketConnection(server, socketOptions);

server.listen(port, () => console.log(`Listening on port ${port}`));
