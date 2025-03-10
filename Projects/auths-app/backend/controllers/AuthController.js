const jwt = require("jsonwebtoken");
const UserModel = require("../models/User.model");
const bcrypt = require('bcrypt');

const signup = async (req,res) =>{
try{
    const {name,email,password} = req.body;
    const user = await UserModel.findOne({email});
    console.log(user)
    if(user){
        return res.status(409).json({message: 'User is already exist, you can login',success: false})
    }
    const userModel = new UserModel({name,email,password})
    userModel.password = await bcrypt.hash(password,10);
    await userModel.save();
    res.status(201).json({
        message: "Signup Successfully",
        success: true
    })

}catch(err){
    res.status(500).json({message: "Intenal Sever Error",success: false})
}
}

const login = async (req,res) =>{
try{
    const {email,password} = req.body;
    const user = await UserModel.findOne({email});
    const errorMsg = 'Auth Failed! Email or Password is wrong';
    if(!user){
        return res.status(409).json({message: errorMsg,success: false})
    }

    const isPassEqual = await bcrypt.compare(password,user.password);
    if(!isPassEqual){
        return res.status(403).json({message: errorMsg,success: false})
    }

    const jwtToken = jwt.sign({email: user.email,_id: user._id},process.env.JWT_SECRET,{expiresIn: '1m'})

    res.status(200).json({
        message: "Login Successfully",
        success: true,
        jwtToken,
        email,
        name: user.name
    })

}catch(err){
    res.status(500).json({message: "Intenal Sever Error",success: false})
}
}



module.exports = {signup,login};