const mongoose = require("mongoose");

main()
  .then((data) => {
    {
      console.log("Connection is successful......");
    }
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/amazon");
}

const bookSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String
  },
  price:{
    type: Number
  }
});

const Book = mongoose.Model("Book", bookSchema);



