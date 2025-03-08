const express = require("express");
const cors = require('cors');
const AuthRouter = require('./routes/AuthRouter');
const ProductRouter = require('./routes/ProductRouter');
const app = express();

require('dotenv').config();
require('./db/db');

const PORT = process.env.PORT ||  8080;

app.get("/test", async (req,res) =>{
    res.send("Hello world");
})

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.use('/auth',AuthRouter);
app.use('/product', ProductRouter);

app.listen(PORT, () =>{
    console.log(`Server is running on ${PORT}`)
})


