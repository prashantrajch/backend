require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 3000;

//Mongoose
const mongoose = require('mongoose');
const User = require('./models/user');
const Note = require('./models/notes');
//Cors Policy
const cors = require('cors');
const { authenticateToken } = require('./utils/utilities');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());


main().then(() => {
    console.log('Successful connected with mongo database');
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/notesApp');
}

app.listen(PORT, () =>{
    console.log(`I am lisiting on ${PORT}`);
})


//Testing
app.get('/', (req,res) =>{
    res.send("Hello world");
})

//Creating Account
app.post('/signUp',async (req,res) =>{

    const {fullName,email,password} = req.body;

    if(!fullName){
      return  res.status(400).send({error: true,message: 'Full Name is required'});
    }
    if(!email){
       return res.status(400).json({error: true,message: 'Email is required'});
    }
    if(!password){
       return res.status(400).send({error: true,message: 'Password is required'});
    }

    const availableUser = await User.findOne({email: email});

    if(availableUser){
        return res.status(403).send({error: true,message: "User already exist"});
    }

    const user = new User({fullName,email,password});
    await user.save();

    const accessToken = jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET,{
        expiresIn: '36000m'
    })

    res.status(200).send({error: false,user,accessToken,message: 'Registration Successful'});

})

// Login User
app.post('/login',async (req,res) =>{
    
    const{email,password} = req.body;

    if(!email){
        return res.status(400).send({message: 'Email is required'});
    }
    if(!password){
        return res.status(400).send({message: 'Password is required'});
    }

    const userInfo = await User.findOne({email: email});

    if(!userInfo){
        return res.status(400).json({message: 'User not found'});
    }
    if(userInfo.email === email && userInfo.password === password){
        const user = {user: userInfo};
        const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '36000m'
        })

        return res.send({
            error: false,
            message: 'Login Successful',
            email,
            accessToken
        })
    }
    else{
        return res.status(400).send({
            error: true,
            message: 'Invalid Credentials',
        })
    }
})

// Get user
app.get("/get-user",authenticateToken, async (req,res) =>{
    const {user} = req.user;
    const isUser = await User.findOne({_id: user._id});
    
    if(!isUser){
        return res.sendStatus(401).send("User not found");
    }
    return res.send({
        user: {fullName: isUser.fullName, email: isUser.email, '_id': isUser._id,createdOn: isUser.createdOn},
        message: '',
    })
})

//Add Note
app.post('/add', authenticateToken, async (req,res) =>{
    const{title,content,tags} = req.body;
    const{user} = req.user;
    
    if(!title){
        return res.status(400).send({error: true,message: 'Title is required'});
    }
    if(!content){
        return res.status(400).send({error: true,message: 'Content is required'});
    }

    try{
        const note = new Note({
            title,
            content,
            tags: tags  || [],
            userId: user._id,
        })
        await note.save();

        return res.send({
            error: false,
            note,
            message: "Note added successfully"
        })
    }catch(err){
        return res.status(500).send({
            error: true,
            message: 'Internal Server Error',
        })
    }
})

// Edit Note
app.put("/edit/:noteId", authenticateToken, async(req,res) =>{
    const noteId = req.params.noteId;
    const {title,content,tags,isPinned} = req.body;
    const {user} = req.user;
    if(!title && !content && !tags){
        return res.status(400).send({
            error: true,
            message: "No changes provided"
        })
    }
    try{
        const note = await Note.findOne({_id: noteId, userId: user._id});
        if(!note){
            return res.status(400).send({error: true,message: 'Note not found'});
        }
        if(title) note.title = title;
        if(content) note.content = content;
        if(tags) note.tags = tags;
         note.isPinned = isPinned;

        await note.save();

        return res.send({
            error: false,
            note,
            message: 'Note updated successfully',
        })
    }catch(err){
        return res.status(500).send({error: true,message: 'Internal Server Error'})
    }
})

// Get All Notes
app.get('/allNotes', authenticateToken, async (req,res) =>{
    const {user} = req.user;
    try{
        const notes = await Note.find({userId: user._id}).sort({isPinned: -1});

        return res.send({
            error: false,
            notes,
            message: 'All notes retrieved successfully'
        });
    }
    catch(err){
        return res.status(500).send({
            error: true,
            message: 'Internal Server Error'
        })
    }
})

// Delete Note
app.delete("/delete/:noteId",authenticateToken, async (req,res) =>{
    const noteId = req.params.noteId;
    const {user} = req.user;

    try{
        const note  = await Note.findOne({_id: noteId,userId: user._id});
        if(!note){
            return res.status(404).send({error: true, message: "Note not found"});
        }

        await Note.deleteOne({_id: noteId,userId: user._id});

        return res.send({
            error: false,
            message: "Note deleted successfull"
        })
    }catch(err){
        return res.status(500).send({
            error: true,
            message: "Internal server error",
        })
    }
})

// Update isPinned Value
app.put("/updatePinnedNote/:noteId", authenticateToken, async (req,res) =>{
    const noteId = req.params.noteId;
    const {isPinned} = req.body;
    const {user} = req.user;

    try{
        const note = await Note.findOne({_id: noteId, userId: user._id});
        if(!note){
            return res.status(400).send({error: true,message: 'Note not found'});
        }
        note.isPinned = isPinned;

        await note.save();

        return res.send({
            error: false,
            note,
            message: 'Note updated successfully',
        })
    }catch(err){
        return res.status(500).send({error: true,message: 'Internal Server Error'})
    }
})

// Search Notes
app.get("/searchNotes/", authenticateToken, async (req,res) =>{
    const {query} = req.query;
    const {user} = req.user;

    if(!query){
        return res.status(400).send({error: true,message: "Search query is required"});
    }

    try{
        const matchingNotes = await Note.find({userId: user._id, $or:[
            {title: {$regex: new RegExp(query, "i")}},
            {content: {$regex: new RegExp(query, "i")}},
        ]})
        return res.send({
            error: false,
            notes: matchingNotes,
            message: "Notes matching the search query retrieved successfully"
        })

    }catch(err){
        return res.status(500).send({
            error: true,
            message: "Internal Server Error"
        })
    }

})



