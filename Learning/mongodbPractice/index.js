const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const port = 3000;
const Chat = require("./modals/chat.js");
const ExpressError = require("./ExpressError.js");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.listen(port, () => {
  console.log(`app listening on ${port}`);
});

// let chat1 = new Chat({
//   from: "neha kumari",
//   to: "Priya Singh",
//   msg: "Send me you exam sheets",
//   create_at: new Date(),
// });

// chat1
//   .save()
//   .then((res) => console.log(res))
//   .catch((err) => console.log(err));

// app.listen(port, () => {
//   console.log(`app is listening on ${port}`);
// });

main()
  .then(() => console.log("connection succesfull.... with mongodb"))
  .catch((err) => console.log(err));

// async function main() {
//   await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
// }

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/fakewhatsapp");
}

app.get("/", (req, res, next) => {
  res.render("index");
});

//Index Route
app.get(
  "/chat",
  asyncWrap(async (req, res, next) => {
    let chats = await Chat.find();
    res.render("chat", { chats });
  })
);

//New Route
app.get("/chat/add", (req, res, next) => {
  // throw new ExpressError(404,'Page not found')
  res.render("add");
});

//Create Route
// app.post("/chat/add", (req, res,next) => {
//   const { from, to, message } = req.body;
//   const newChat = new Chat({
//     from: from,
//     to: to,
//     msg: message,
//     create_at: new Date(),
//   });
//   newChat
//     .save()
//     .then(() => {
//       console.log("successfull form submited");
//       res.redirect("/chat");
//     })
//     .catch((err) => {
//       console.log(err.errors);
//       res.send(err.errors.msg);
//       // res.send(err.error.msg);
//     });
// });

const handleValidationErr = (err) => {
  console.log("validation error occured");
  return err;
};

app.post(
  "/chat/add",
  asyncWrap(async (req, res, next) => {
    const { from, to, message } = req.body;
    const newChat = new Chat({
      from: from,
      to: to,
      msg: message,
      create_at: new Date(),
    });
    await newChat.save();
    res.redirect("/chat");
  })
);

function asyncWrap(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((err) => next(err));
  };
}

//New - Show Route
app.get(
  "/chat/:id",
  asyncWrap(async (req, res, next) => {
    let { id } = req.params;
    let chat = await Chat.findById(id);
    // if (!chat) {
    //   //He doesn't work
    //   // throw new ExpressError(404,"Chat not Found");
    //   next(new ExpressError(500,"Chat not Found"));
    // }
    res.render("edit", { chat });
  })
);

//Edit Route
app.get("/chat/:id/edit", async (req, res, next) => {
  const { id } = req.params;
  let chat = await Chat.findById(id);
  res.render("edit", { chat });
});

//Update Route
app.patch("/chat/:id", async (req, res, next) => {
  const { id } = req.params;
  const { from, to, message } = req.body;
  let updatedChat = await Chat.findByIdAndUpdate(
    id,
    { from: from, to: to, msg: message },
    { runValidators: true, new: true }
  );
  console.log(updatedChat);
  res.redirect("/chat");
});

//Delete Route
app.delete("/chat/:id", async (req, res, next) => {
  const { id } = req.params;
  let deletedChat = await Chat.findByIdAndDelete(id);
  console.log(deletedChat);
  res.redirect("/chat");
});

app.use((err, req, res, next) => {
  console.log(err.name);
  if (err.name == "ValidationError") {
    err = handleValidationErr(err);
  }
  next(err);
});

//Error Handling Middleware
app.use((err, req, res, next) => {
  let { status = 500, message } = err;
  res.status(status).send(message);
});
