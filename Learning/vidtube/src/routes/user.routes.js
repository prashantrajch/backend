const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controllers");
const upload = require("../middlewares/multer.middlewares");
const { verifyJWT } = require("../middlewares/auth.middlewares");

// unsecured routes

router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  userController.registerUser
);
router.route("/login").post(userController.loginUser);
router.route("/refresh-token").post(userController.refreshAccessToken);


// secured routes

router.route("/logout").post(verifyJWT, userController.logoutUser);
router.route('/change-password').post(verifyJWT,userController.changeCurrentPassword);
router.route('/current-user').get(verifyJWT,userController.getCurrentUser);
router.route('/c/:username').post(verifyJWT,userController.getUserChannelProfile);
router.route('/update-account').patch(verifyJWT,userController.updateAccountDetails);
router.route('/update-avatar').patch(verifyJWT,upload.single('avatar'),userController.updateUserAvatar);
router.route('/update-coverImage').patch(verifyJWT,upload.single('coverImage'),userController.updateUserCoverImage);
router.route('/history').get(verifyJWT,userController.getWatchHistory);


module.exports = router;
