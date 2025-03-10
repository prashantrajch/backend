const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, //cloudinary URL
      required: true,
    },
    coverImage: {
      type: String, // cloudinary URL
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  // if you dont't modified the password then we won't encrypt password
  if (!this.isModified("password")) return next();

  // if you modified the password then we encrypt the password
  this.password = bcrypt.hash(this.password, 10);

  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
 return  bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function(){
  // short lived access token
  return jwt.sign({
    _id: this._id,
    email: this.email,
    username: this.username,
    fullName: this.fullName
  },
  process.env.ACCESS_TOKEN_SECRET,
  {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
)
}
userSchema.methods.generateRefreshToken = function(){
  // short lived access token
  return jwt.sign({
    _id: this._id
  },
  process.env.REFRESH_TOKEN_SECRET,
  {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
)
}


const User = mongoose.model("User", userSchema);
module.exports = User;
