const { Router } = require("express");
const router = Router();
const {
    loginUser,
    logoutUser,
    registerUser,
    forgotPassword,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateUserAvatar,
    updateUserCoverImage,
    updateAccountDetails,
    verifyToken,
    resetPassword,
} = require("../../controllers/users/users.controller.js");
const { upload } = require("../../middlewares/multer.middleware.js");
const { verifyJWT } = require("../../middlewares/auth.middleware.js");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/forgot-password").post(forgotPassword);
router.route("/verify-token").post(verifyToken);
router.route("/reset-password").post(resetPassword);

// Secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);

router
    .route("/avatar")
    .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router
    .route("/cover-image")
    .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

module.exports = router;
