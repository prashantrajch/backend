const express = require("express");
const app = express();
const PORT = 4000;
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const methodOverride = require('method-override');


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "view"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'))

let posts = [
  {
    id: uuidv4(),
    username: "prashant_raj_ch",
    content: "I ❤ Coding",
  },
  {
    id: uuidv4(),
    username: "amansinha02",
    content: "I love Ghutka",
  },
  {
    id: uuidv4(),
    username: "SaurabhDuttaGupta",
    content: "hey Bpscc im commint",
  },
];

app.listen(PORT, () => {
  console.log(
    `Hey....Prashant Raj I am listen your port ${PORT}..Now you have work`
  );
});

app.get("/posts", (req, res) => {
  res.render("home.ejs", { posts });
});
app.get("/posts/new", (req, res) => {
  res.render("new.ejs");
});

app.get("/posts/:id", (req, res) => {
  let { id } = req.params;
  let post = posts.find((post) => id == post.id);
  res.render("show.ejs", { post });
});

app.get("/posts/:id/edit", (req, res) => {
  let { id } = req.params;
  let post = posts.find((post) => id == post.id);
  res.render("edit.ejs", { post });
});

app.post("/posts", (req, res) => {
  let { username, content } = req.body;
  posts.push({
    id: uuidv4(),
    username: username,
    content: content,
  });
  res.redirect("/posts");
});

app.patch('/posts/:id', (req,res) => {
  let {id} = req.params;
  let newContent = req.body.content;
  let post = posts.find((post) => id == post.id);
  post.content = newContent;
  res.redirect('/posts');
})

app.delete('/posts/:id', (req,res) => {
  let {id} = req.params;
  posts = posts.filter((post) => id != post.id);
  res.redirect('/posts');
})