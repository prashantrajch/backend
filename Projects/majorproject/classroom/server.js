const express = require("express");
const app = express();

const users = require("./routes/user");
const posts = require("./routes/post");

const cookieParser = require("cookie-parser");

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`server is listening to ${PORT}`);
});

app.use(cookieParser("secretcode"));

app.get("/getsignedcookie", (req, res) => {
  res.cookie('made-in', "India", { signed: true });
  res.send("signed cookie sent");
});

app.get("/verfiy", (req, res) => {
  // console.log(req.cookies);
  console.log(req.signedCookies);
  res.send("vefified");
});

app.get("/greet", (req, res) => {
  let { name = "anonymous" } = req.cookies;
  res.send(`Hi, ${name}..!`);
});

app.get("/", (req, res) => {
  console.dir(req.cookies);
  res.send("Hi, I am root..!");
});

app.get("/getCookies", (req, res) => {
  res.cookie("Greet", "Hello");
  res.cookie("madeIn", "India");
  res.send("sent you some cookies...!");
});

app.use("/users", users);
app.use("/posts", posts);
