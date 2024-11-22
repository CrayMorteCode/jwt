const express = require("express");
const mysql = require("mysql");
const app = express();
const jwt= require("jsonwebtoken");
const PORT = 3000;
const secret_key = process.env.JWT_SECRET ||"p5G!v@r#Wz$8mQe3XjY%2&nL";
const payload = {user:"123",username:"example_user"};
const expiration = "1h";
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const db = mysql.createConnection({ 
  host: "localhost",
  user: "root",
  password: "cR@yM06t3",
  database: "user_db",
});
db.connect((err) => {
  if (err) throw err;
  return;
});
app.get("/users", (req, res) => {
  res.send("hello there");
});
app.post("/registration", (req, res) => {
  const { username, email, password } = req.body;
  let sql = "insert into users (username,email,password) values(?,?,?)";
  db.query(sql, [username, email, password], (err, results) => {
    if (err) {
      console.log("error creating a new user");
    }
    return res.status(200).json({ message: "user successfully created" });
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  let query = "select * from users where username = ? AND password = ?";
  db.query(query, [username, password], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "error logging in" });
    }
    if (results.length > 0) {
      const token = jwt.sign(payload,secret_key,{expiresIn:expiration});
      return res.status(200).json({ login: "successful" ,token:token});
    }
    return res.status(400).json({ Error: "invalid credentials" });
  });
});

app.listen(PORT, () => {
  console.log(`port running on${3000}`);
});





