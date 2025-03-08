const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');



const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// common middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());


// import routes
const healthCheckRouter = require('./routes/healthcheck.routes')
const userRouter = require('./routes/user.routes');
const errorHandler = require("./middlewares/error.middlewares");

//routes
app.use('/api/v1/healthcheck', healthCheckRouter)
app.use('/api/v1/users',userRouter)

app.get('/api/v1/test',(req,res) =>{
  res.send('Hello world')
})


// app.use(errorHandler)
module.exports = app;
