const mongoose = require("mongoose");
const Chat = require("./modals/chat.js");

main()
  .then(() => console.log("connection succesfull.... with mongodb"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/fakewhatsapp");
}

let allChats = [
  {
    from: "Alice",
    to: "Charlie",
    msg: "Hello!",
    create_at: new Date(),
  },
  {
    from: "Bob",
    to: "Dave",
    msg: "How are you?",
    create_at: new Date(),
  },
  {
    from: "Eve",
    to: "Alice",
    msg: "What's up?",
    create_at: new Date(),
  },
  {
    from: "Charlie",
    to: "Eve",
    msg: "Good morning!",
    create_at: new Date(),
  },
  {
    from: "Dave",
    to: "Bob",
    msg: "Have a great day!",
    create_at: new Date(),
  },
  {
    from: "Alice",
    to: "Eve",
    msg: "See you later!",
    create_at: new Date(),
  },
  {
    from: "Charlie",
    to: "Dave",
    msg: "Let's meet at 5 PM.",
    create_at: new Date(),
  },
  {
    from: "Bob",
    to: "Alice",
    msg: "Don't forget about the meeting tomorrow.",
    create_at: new Date(),
  },
  {
    from: "Eve",
    to: "Charlie",
    msg: "Congratulations!",
    create_at: new Date(),
  },
  {
    from: "Dave",
    to: "Alice",
    msg: "Happy birthday!",
    create_at: new Date(),
  },
];

Chat.insertMany(allChats);
