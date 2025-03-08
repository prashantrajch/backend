const express = require("express");
const app = express();
const path = require("path");
const port = 3000;
const fs = require("fs");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Now im listening on ${port}`);
});

app.get("/", (req, res) => {
  try {
    fs.readdir("./files", function (err, files) {
      if (err) throw err;
      res.render("home", { files });
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/create", (req, res) => {
  fs.writeFile(
    `./files/${req.body.title.split(" ").join("")}.txt`,
    req.body.task,
    function (err) {
      if (err) throw err;
      res.redirect("/");
    }
  );
});

app.get("/show/:filename", (req, res) => {
  fs.readFile(
    `./files/${req.params.filename}.txt`,
    "utf-8",
    (err, fileData) => {
      res.render("show", { filename: req.params.filename, fileData });
    }
  );
});

app.get("/edit/:filename", (req, res) => {
  res.render("edit", { filename: req.params.filename });
});

app.post("/edit", (req, res) => {
  const { oldname, newname } = req.body;
  fs.rename(`./files/${oldname}.txt`, `./files/${newname.split(' ').join('')}.txt`, (err) => {
    res.redirect('/')
    console.log(err);
  });
});
