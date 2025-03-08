const express = require("express");
const app = express();

const session = require("express-session");
const flash = require("connect-flash");

app.listen(3000, () => {
  console.log("server is listening to 3000");
});

const sessionOptions = {
  secret: "mysupersecretstring",
  resave: false,
  saveUninitialized: true,
};

app.set("view engine", "ejs");

app.use(session(sessionOptions));
app.use(flash());

//Third Method of Flash
app.use((req, res, next) => {
  res.locals.successMsg = req.flash("success");
  res.locals.errorMsg = req.flash("error");
  next();
});

app.get("/", (req, res) => {
  res.send("I am run ");
});

app.get("/test", (req, res) => {
  res.send("test successful!");
});

app.get("/reqcount", (req, res) => {
  if (req.session.count) {
    req.session.count++;
  } else {
    req.session.count = 1;
  }
  res.send(`You sent a request ${req.session.count} times`);
});

app.get("/register", (req, res) => {
  let { name = "anonymous" } = req.query;
  req.session.name = name;
  //   res.send(name);
  if (name == "anonymous") {
    req.flash("error", "user not registered");
  } else {
    req.flash("success", "user registered successfully!");
  }
  res.redirect("/hello");
});

//First Method of Flash.
// app.get("/hello", (req, res) => {
//   res.render("page", { name: req.session.name, msg: req.flash("success") });
//   //   res.send(`hello,${req.session.name}`);
// });

//Second Method of Flash
app.get("/hello", (req, res) => {
  // res.locals.successMsg = req.flash("success");
  // res.locals.errorMsg = req.flash("error");
  res.render("page", { name: req.session.name });
});
