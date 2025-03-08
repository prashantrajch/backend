const express = require('express');
const app = express();
const port = 8080;

app.listen(port, () => {
    console.log(`now my port ${port} is listen to me`);
})


app.get('/register', (req, res) => {
    const {username,password} = req.query
    res.send(`Username:-   ${username} <br> Password:-    ${password}`);
})

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.post('/register', (req, res) => {
    const {username2, password2} = req.body;
    res.send(`Username:- ${username2} <br> Password:-  ${password2}`)
})