const mongoose = require("mongoose");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/test");
}

main()
  .then((res) => {
    console.log("Connection Successful...");
  })
  .catch((err) => console.log(err));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
});

const User = mongoose.model("User", userSchema);

const user1 = new User({
  name: "Prashant Raj",
  email: "prashantraj@gmail.com",
  age: 24,
});
const user2 = new User({
  name: "Sumant Raj",
  email: "sumantraj@yahoo.com",
  age: 40,
});


// user2
//   .save()
//   .then((res) => console.log("Data Submited successful", res))
//   .catch((err) => console.log(err));

// User.insertMany([
//     {name: 'Tony', email: 'tony@yahoo.com', age: 50},
//     {name: 'Bruce', email: 'bruce@yahoo.com', age: 47},
//     {name: 'Peter', email: 'peter@yahoo.com', age: 20}

// ]).then((data) => console.log(data)).catch((err) => console.log(err));

// User.find({}).then(data => console.log(data)).catch((err) => console.log(err))
// User.find({age: {$gte:45}}).then(data => console.log(data)).catch((err) => console.log(err))

// User.find({age: {$lt: 40}}).then((data) => console.log(data)).catch((err) => console.log(err));
// User
//   .updateOne({ name: "Prashant Raj" }, { email: "prashantraj9525@gmail.com" })
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((err) => console.log(err));
// User.findOneAndUpdate({ age: 40 }, { age: 43 },{new: true})
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((err) => console.log(err));

// User.updateMany({age: {$lt: 40}}, {age: 45}).then((data) =>{
//   console.log(data);
// }).catch(err => console.log(err))

// User.findByIdAndDelete('6654c7f11fdc6a7e9987c654',{new: true}).then(data => console.log(data)).catch(err => console.log(err))
// User.deleteMany({age: {$lte: 45}}).then((data) => console.log(data)).catch((err) => console.log(errr))

User.find({}).then((data) => console.log(data)).catch((err) => console.log(err));
