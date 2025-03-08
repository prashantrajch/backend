const express = require('express');
const path = require('path');

const app = express();
const port = 4040;

app.listen(port, () =>{
    console.log(`the server ${port} is listen to me`);
})

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, 'public/css')));
app.use(express.static(path.join(__dirname, 'public/js')));


app.get('/search', (req,res) => {

    console.log('hello im run');
})

app.get('/home', (req,res) => {
    res.render('home.ejs')
})

app.get('/ig/:username', (req,res) => {
    let {username} = req.params;
    let instaData = require('./data.json');
    const data = instaData[username];
    if(data){
        res.render('instagram.ejs', {data,title: "Instagram", username})
    }
    else{
        res.send('you have wrong input')
    }
})

app.get('/rolldice', (req,res) => {

    let rollDice = Math.floor(Math.random() * 6) + 1;

    res.render('rollDice.ejs', {diceVal: rollDice,title: "Roll Dice", username: ''});
})