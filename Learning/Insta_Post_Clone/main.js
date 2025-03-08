const express = require("express");
const app = express();
const PORT = 8080;
const path = require('path');
const {v4: uuidv4} = require('uuid');
const methodOverride = require('method-override');
const multer  = require('multer')
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        return cb(null, './uploads');
    },
    filename: function(req,file,cb){
        return cb(null,file.originalname)
    }
})
const upload = multer({storage});

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'/view'));
app.use(express.static(path.join(__dirname,'/public')));
app.use('/uploads',express.static(path.join(__dirname, '/uploads')))
app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use(methodOverride('_method'));


app.listen(PORT,() => {
    console.log(`hey...Prashant Raj, I am listen your port ${PORT}...! Now you have work`);
})

let posts = []

app.get('/ig', (req,res) => {
    res.render('home.ejs', {posts})
})


app.get('/ig/new', (req,res) =>{
    res.render('newPost.ejs')
})

app.post('/ig', upload.single('photo'), (req,res) => {
    // console.log(req.file, req.body);
    console.log(req.file)
    let {originalname,destination,filename,path}= req.file;
    let {username,content}= req.body;
    posts.push({
        id: uuidv4(),
        username: username,
        // img: `${destination}/${filename}`,
        img: path,
        content: content,
        imgName: originalname,
    })
    res.redirect('/ig');
})

app.get('/ig/:id/edit', (req,res) => {
    let {id} = req.params;
    let post = posts.find((post) => id == post.id);
    res.render('edit.ejs', {post});
})

app.patch('/ig/:id', (req,res) => {
    let {id} = req.params;
    let newContent = req.body.content;
    let post = posts.find((post) => id == post.id);
    post.content = newContent;
    res.redirect('/ig');
})


app.delete('/ig/:id', (req,res) => {
    let {id} = req.params;
    posts = posts.filter((post) => id != post.id);
    res.redirect('/ig');
})
