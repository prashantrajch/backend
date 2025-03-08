const express = require('express');
const app = express();
let port = 8000;

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})


app.get('/:search/:color', (req,res) => {
const {search, color} = req.params;
res.send(`<p>you search <b>${search}</b> and the also you search the color <b>${color}</b></p>`)
})
app.get('/:search', (req,res) => {
const {q} = req.query;
if(!q){
    res.send('nothing search')
}
res.send(`<p>you search <b>${q}</b></p>`)
})


