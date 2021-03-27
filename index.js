require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const Router = require("./src/routers/index");

const app = express();

app.use(express.json());
app.use(express.raw());
app.use(express.urlencoded({ extended: true }));

app.use(Router);

// router.post("/auth", (req, res) => {
//   const { username, password } = req.body;
//   const sqlQuery =
//     "SELECT ?? FROM users left join roles on users.role_id = roles.id  where username = ?";
//   const columns = ["username", "password", "name"];
//   db.query(
//     sqlQuery,
//     [columns, username, password],
//     function (error, results, fields) {
//       if (error) throw error;
//       if (results.length <= 0)
//         return res.status(200).json({ message: "user not found" });
//       if (results[0].password === password) {
//         return res.json({ user: results[0] });
//       }
//       res.send("not found");
//     }
//   );
//   //   res.json({ username, password });
// });

// router.get("/users", async (req, res) => {
//   try {
//     const users = await db.query("SELECT * from users");
//     console.log(users);
//     return res.json({ done: "as", users: users });
//   } catch (error) {
//     console.log(error, "err");
//     return res.json(new Error(error));
//   }
// });

// router.post("/users", (req, res) => {
//   const {
//     name,
//     username,
//     email,
//     password,
//     confirm_password: confirmPassword,
//   } = req.body;

//   if (password !== confirmPassword) {
//     return res.status(422).json({ message: `password doesn't match` });
//   }

//   db.query(
//     `SELECT username from users where username = ?`,
//     [username],
//     (error, results) => {
//       if (error) return res.status(500).json(error);
//       if (results.length >= 1) {
//         return res.status(422).json({ message: "username already exists" });
//       }
//     }
//   );

//   db.query(
//     `SELECT username from users where email = ?`,
//     [email],
//     (error, results) => {
//       if (error) return res.status(500).json(error);
//       if (results.length >= 1) {
//         return res.status(422).json({ message: "email already exists" });
//       }
//     }
//   );

//   db.query(
//     `INSERT INTO users(name,username,email,password) values ('${name}','${username}','${email}','${name}')`
//   );
// });

// router.get("/", (req, res) => {
//   res.send("adfa");
// });

const port = process.env.PORT;
app.listen(port, () => console.log(`Listening on port ${port}`));
