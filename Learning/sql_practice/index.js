const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require("uuid");
const port = 3000;

const getUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "api_data",
  password: "Prashantrajch#@1",
});

// let user = ['123@abc','random_user','random@gmail.com','random@123'];
// let q = `INSERT INTO user(id,username,email,password) VALUES (?,?,?,?)`;
// try {
//     connection.query(q,user,(err, result) => {
//         if (err) throw err;
//         console.log(result);
//     });
// } catch (err) {
//     console.log(err);
// }

// let users = [['123b','random_userb','randomb@gmail.com','random@123b'],['123c','random_userc','randomc@gmail.com','random@123c']]
// let q2 = `INSERT INTO user(id,username,email,password) VALUES (?,?,?,?)`;
// try {
//   connection.query(q2,[users],(err, result) => {
//     if (err) throw err;
//     console.log(result);
//   });
// } catch (err) {
//   console.log(err);
// }

// let q3 = `INSERT INTO user(id,username,email,password) VALUES ?`;
// let data = [];
// for (let i = 1; i <= 100; i++) {
//   data.push(getUser());
// }

// try {
//   connection.query(q3, [data], (err, result) => {
//     if (err) throw err;
//     console.log(result);
//   });
// } catch (err) {
//   console.log(err);
// }

// connection.end();

app.listen(port, () => {
  console.log(`I am listening on port ${port}`);
});

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// this route is use for home page to show how many data in database
app.get("/", (req, res) => {
  let q = "SELECT COUNT(*) FROM user";
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      res.render("home", { result: result[0]["COUNT(*)"] });
    });
  } catch (err) {
    console.log(err);
    res.send("Some Error in DB");
  }
});

// this route is use for to show all users data in database
app.get("/user", (req, res) => {
  let q = "SELECT id,username,email FROM user";
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      res.render("show", { result });
    });
  } catch (err) {
    console.log(err);
    res.send("Some Error in DB");
  }
});

// this route is use for to show edit page to edit your data in database
app.get("/user/edit/:id", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id = '${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      res.render("edit", { result: result[0] });
    });
  } catch (err) {
    console.log(err);
    res.send("Some Error in DB");
  }
});

// this route is use for to show delete page your data in database
app.get("/user/delete/:id", (req, res) => {
  const { id } = req.params;
  let q = `SELECT * FROM user WHERE id = '${id}'`;
  try {
    connection.query(q, (err, result) => {
      res.render("delete", { result: result[0] });
    });
  } catch (err) {
    res.send("Some Error in DB");
  }
});

// this route is use for add page to add user data in database
app.get("/user/add", (req, res) => {
  res.render("add");
});

// this route is use for to add your data in database
app.post("/user/add", (req, res) => {
  let id = uuidv4();
  let { username, email, password } = req.body;
  let userData = [id, username, email, password];
  // let q = `INSERT INTO user (id,username,email,password) VALUES ("${id}","${username}","${email}","${password}")`;
  let q = "INSERT INTO user(id,username,email,password) VALUES (?,?,?,?)";
  try {
    connection.query(q, userData, (err, result) => {
      console.log(result);
      res.redirect("/");
    });
  } catch (err) {
    res.send("Some error in DB");
    console.log("i am error in cathch block", err);
  }
});

// this route is use for to edit you data in database
app.patch("/user/edit/:id", (req, res) => {
  let { id } = req.params;
  let { username: clientNewUsername, password: clientPassword } = req.body;
  let q = `SELECT * FROM user WHERE id = '${id}' `;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      if (user.password == clientPassword) {
        let q = `UPDATE user SET username = '${clientNewUsername}' WHERE id = '${id}' `;
        connection.query(q, (err, result) => {
          if (err) throw err;
          res.redirect("/user");
        });
      } else {
        res.send("Password is use wrong....please fill correct password");
      }
    });
  } catch (err) {
    console.log(err);
    res.send("Some Error in DB");
  }
});

// this route is use for delete you data in database
app.delete("/user/delete/:id", (req, res) => {
  let { id } = req.params;
  let q = `DELETE FROM user WHERE id = '${id}' `;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      res.redirect("/user");
    });
  } catch (err) {
    console.log(err);
    res.send("Some Error in DB");
  }
});
