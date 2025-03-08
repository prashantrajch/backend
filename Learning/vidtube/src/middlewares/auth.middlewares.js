const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const User = require('../models/user.models');


module.exports.verifyJWT = asyncHandler(async (req,_,next) =>{
    const token = req.cookies.accessToken || req.header("Authorization")?.replace('Beared ', "");
    if(!token){
        throw new ApiError(401,"Unauthorized")
    }

    try {
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id)
                    .select("-password, -refreshToken");

        if(!user){
            throw new ApiError(401,"Unauthorized");
        }

        req.user = user;
        next()

    } catch (err) {
        throw new ApiError(401,err?.message || "Invalid access token");
    }
})
