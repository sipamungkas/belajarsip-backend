require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Router = require("./src/routers/index");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.raw());
app.use(express.urlencoded({ extended: true }));

app.use("/v1", Router);

const port = process.env.PORT;
app.listen(port, () => console.log(`Listening on port ${port}`));
