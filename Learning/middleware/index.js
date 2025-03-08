const express = require("express");
const app = express();
const ExpressError = require('./ExpressError');
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`I am listing on port ${PORT}`);
});

// app.use((req,res) =>{
//     console.log("Hi,I am middleware");
//     res.send("hi i am middleware");
// })

// app.use((req,res) =>{
//     let {query} = req.query;
//     console.log("Hi,I am middleware");
//     console.log("i am query",query);
// })

// app.use((req,res,next) =>{
//     console.log("Hi,i am 1st middleware");
//     next();
//     //after next call we don't write any program.
//     // console.log("This is after next");
// })

// app.use((req,res,next) =>{
//     console.log("Hi,i am 2nd middleware");
//     return next();
//     console.log("This is after next");
// })

//Logger - morgan
app.use((req, res, next) => {
  req.time = Date.now(Date.now()).toString();
  console.log(req.method, req.path, req.time, req.hostname);
  next();
});

// app.use("/api",(req,res,next) =>{
//     let {token} = req.query;

//     if(token === 'giveaccess'){
//         next()
//     }
//     res.send("ACCESS DENIED..!");
// })

//Multiple Middlewares
// const checkToken = (req, res, next) => {
//   let { token } = req.query;

//   if (token === "giveaccess") {
//     next();
//   }
//   res.send("ACCESS DENIED..!");
// };

//Multiple Middlewares
const checkToken = (req, res, next) => {
  let { token } = req.query;
  if (token === "giveaccess") {
    next();
  }
  //Handling Error by ExpressJs
  throw new ExpressError(401,"ACCESS DENIED..!");
};


// app.get("/api", (req, res) => {
//   res.send({ name: "Prashant Raj", class: "BCA" });
// });

//Multiple Middlewares
app.get("/api", checkToken,(req, res) => {
  res.send({ name: "Prashant Raj", class: "BCA" });
});

app.get("/", (req, res) => {
  res.send("Hi, I am root.");
});

app.get("/random", (req, res) => {
  res.send("This is a random page");
});

//Error
app.get('/err',(req,res) =>{
  abcd = abcd
})

//Admin
app.get('/admin',(req,res) =>{
  throw new ExpressError(403,"Access to admin to Forbidden");
})


//Custom Error By oen Class
// 1. 
// app.use((err,req,res,next) =>{
//   console.log("------- Error ---------");
//   res.send(err);//Send own error in frontend
// })

// 2.
app.use((err,req,res,next) =>{
  let {status = 500,message} = err;
  res.status(status).send(message);//Send own error in frontend
})
 
//Custom Error Handleing Middlewares.
app.use((err,req,res,next) =>{
  console.log("------- Error ---------");
  next(err)
})


app.use((err,req,res,next) =>{
  console.log("------- Error2 ---------");
  next(err)
})



//404
app.use((req, res) => {
  res.status(404).send("Page not found!");
});




