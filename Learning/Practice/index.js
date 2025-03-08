const express = require("express");
const app = express();
const port = 4040;
const path = require("path");

app.listen(port, () => {
  console.log(`My port ${port} is listening to me`);
});

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "/public")));

app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    let name,email,password;
  res.render("home.ejs",{name,email,password});
});


app.get("/register", (req, res) => {
  res.render("register.ejs");
});
app.post("/register", (req, res) => {
    let {name,email,password} = req.body;
    res.render("home.ejs", {name,email,password});
});

app.get('/about', (req,res) => {
    res.render('about.ejs')
})

app.get('/contact', (req,res) => {
    res.render('contact.ejs')
})

app.get('/*', (req,res) => {
    res.send('error.ejs');
})
