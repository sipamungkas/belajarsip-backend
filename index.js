require("dotenv").config();
const express = require("express");
const mysql = require("mysql");

const app = express();
const router = express.Router();
app.use(router);

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "belajarsip",
});

db.connect();

router.get("/users", (req, res) => {
  db.query("SELECT * from users", function (error, results, fields) {
    if (error) return res.status(500).json({ error: "error" });
    return res.status(200).json(results);
  });
});

router.get("/", (req, res) => {
  res.send("adfa");
});

const port = process.env.PORT;
app.listen(port, () => console.log(`Listening on port ${port}`));
