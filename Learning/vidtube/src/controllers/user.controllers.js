const jwt = require("jsonwebtoken");
const User = require("../models/user.models");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");
const { default: mongoose } = require("mongoose");

const generateAccessAndRefreshToken = async (userId) => {
  const user = await User.findById(userId);
  try {
    if (!user) {
      throw new ApiError(404, "user not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (err) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh tokens"
    );
  }
};

module.exports.registerUser = asyncHandler(async (req, res) => {
  //Todo
  const { fullName, email, username, password } = req.body;

  //validation
  if (
    [fullName, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  // when i add cloudninary then call it
  //   const avatar = await cloudinary.uploadOnCloudinary(avatarLocalPath);
  //   let coverImage = "";
  //   if (coverImageLocalPath) {
  //     coverImage = await cloudinary.uploadOnCloudinary(coverImage);
  //   }

  let avatar;
  try {
    avatar = await cloudinary.uploadOnCloudinary(avatarLocalPath);
    console.log("Uploaded avatar", avatar);
  } catch (err) {
    console.log("Error uploading avatar", err);
    throw new ApiError(500, "Failed to upload avatar");
  }

  // For cover image
  let coverImage;
  try {
    coverImage = await cloudinary.uploadOnCloudinary(coverImageLocalPath);
    console.log("Uploaded coverImage", coverImage);
  } catch (err) {
    console.log("Error uploading coverImage", err);
    throw new ApiError(500, "Failed to upload coverImage");
  }

  try {
    const user = await User.create({
      fullName,
      avatar: avatar?.url || avatar,
      coverImage: coverImage?.url || coverImage,
      email,
      password,
      username: username.toLowerCase(),
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering a user");
    }

    return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "User registered successfully"));
  } catch (err) {
    console.log("User Creation failed");
    if (avatar) {
      fs.unlinkSync(avatarLocalPath);
      await cloudinary.deleteFromCloudinary(avatar.public_id);
    }
    if (coverImage) {
      fs.unlinkSync(coverImageLocalPath);
      await cloudinary.deleteFromCloudinary(coverImage.public_id);
    }

    throw new ApiError(500, "Something went wrong while registering a user");
  }
});

module.exports.loginUser = asyncHandler(async (req, res) => {
  // get data from body
  const { email, username, password } = req.body;

  // validation
  if (!email) {
    throw new ApiError(400, "Email is required");
  }
  if (!username) {
    throw new ApiError(400, "Username is required");
  }
  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // validate password
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid Credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password,-refreshToken"
  );

  if (!loggedInUser) {
    throw new ApiError(404, "User not logged In");
  }

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

module.exports.logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    // Todo: need to come back here after middleware
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  }

  return res.status(200)
  .clearCookie('accessToken',options)
  .clearCookie('refreshToken',options)
  .json(new ApiResponse(200,{},"User logged out successfully"))

});

module.exports.refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
    
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token is required");
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed successfully"
        )
      );
  } catch (err) {
    throw new ApiError(
      500,
      "Something went wrong while refreshing access token"
    );
  }
});


module.exports.changeCurrentPassword = asyncHandler(async (req,res) =>{
  const {oldPassword,newPassword} = req.body;
  
   const user = await User.findById(req.user?._id);
   const isPasswordValid = await user.isPasswordCorrect(oldPassword)
   if(!isPasswordValid){
    throw new ApiError(401,'Old password is incorrect');
   }

   user.password = newPassword;

   await user.save({validateBeforeSave: false});

   return res.status(200).json(new ApiResponse(200,{},'Password changed successfully'))

})

module.exports.getCurrentUser = asyncHandler(async (req,res) =>{
   return res.status(200).json(new ApiResponse(200,req.user,"Current user details"));
})

module.exports.updateAccountDetails = asyncHandler(async (req,res) =>{
  const { fullName,email} = req.body;
  if(!fullName){
    throw new ApiError(400,"Fullname is required");
  }
  if( !email){
    throw new ApiError(400,"Email is required");
  }

  const user = await User.findByIdAndUpdate(req.user?._id,{$set: fullName,email},{new: true}).select('-password -refreshToken');

  return res.status(200).json(new ApiResponse(200,user,"Account details updated successfully"));
})

module.exports.updateUserAvatar = asyncHandler(async (req,res) =>{
  const avatarLocalPath = req.file?.path

  if(!avatarLocalPath){
    throw new ApiError(400,"File is required");
  }
  const avatar = await cloudinary.uploadOnCloudinary(avatarLocalPath)

  if(!avatar || !avatar?.url){
    throw new ApiError(500, "Something went wrong while uploading avatar");
  }

  const user = await User.findByIdAndUpdate(req.user?._id,{$set: {avatar: avatar || avatar?.url}},{new: true}).select('-password -refreshToken');
  return res.status(200).json(new ApiResponse(200,user,"Avatar updated successfully"));

})

module.exports.updateUserCoverImage = asyncHandler(async (req,res) =>{
    const coverImageLocalPath = req.file?.path

  if(!coverImageLocalPath){
    throw new ApiError(400,"File is required");
  }
  const coverImage = await cloudinary.uploadOnCloudinary(coverImageLocalPath)

  if(!coverImage || !coverImage?.url){
    throw new ApiError(500, "Something went wrong while uploading coverImage");
  }

  const user = await User.findByIdAndUpdate(req.user?._id,{$set: {coverImage: coverImage || coverImage?.url}},{new: true}).select('-password -refreshToken');
  return res.status(200).json(new ApiResponse(200,user,"Cover Image updated successfully"));

})

module.exports.getUserChannelProfile = asyncHandler(async (req,res) =>{
   const {username} =  req.params;
   if(!username?.trim()){
    throw new ApiError(400, "Username is required");
   }

   const channel = await User.aggregate([
    {$match: {username: username?.toLowerCase()}},
    {$lookup: {
      from: 'subscribtion',
      localField: "_id",
      foreignField: 'channel',
      as: 'subscribers'
    }},
    {
      $lookup:{
        from: 'subscribtion',
        localField: '_id',
        foreignField: 'subscriber',
        as: 'subscriberdTo'
      }
    },
    {
      $addFields:{
        subscribersCount: {
          $size: "$subscibers"
        },
        channelsSubscribedToCount:{
          $size: "$subsciberdTo"
        },
        isSubscribed: {
          $cond: {
            if: {
              $in: [req.user?._id,"$subscribers.subscriber"]
            },
            then: true,
            else: false
          }
        }
      }
    },
    {
      // Project only the necessary data
      $project:{
        fullName: 1,
        username: 1,
        email: 1,
        avatar: 1,
        subscibersCount: 1,
        channelsSubscribedToCount: 1,
        isSubscribed: 1,
        coverImage: 1,
      }
    }

   ])
   if(!channel?.length){
    throw new ApiError(404,"Channel not found");
   }

   return res.status(200).json(new ApiResponse(200,channel[0],'Channel profile fetched successfully'))

})
module.exports.getWatchHistory = asyncHandler(async (req,res) =>{
  
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user?._id)
      }
    },{
      $lookup:{
        from: 'videos',
        localField: 'watchHistory',
        foreignField: "_id",
        as: 'watchHistory',
        pipeline:[
          {
            $lookup: {
              from: 'users',
              localField: 'owner',
              foreignField: '_id',
              as: 'owner',
              pipeline:[
                {
                  $project: {
                    fullName: 1,
                    username: 1,
                    avatar: 1
                  }
                }
              ]
            }
          },{
            $addFields: {
              owner: {
                $first: '$owner'
              }
            }
          }
        ]
      }
    }
  ])

  return res.status(200).json(new ApiResponse(200,user[0]?.watchHistory,'Watch history fetched successfully'))

})

