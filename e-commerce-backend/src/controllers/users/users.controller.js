const { asyncHandler } = require("../../utils/asyncHandler.js");
const { ApiError } = require("../../utils/ApiError.js");
const { ApiResponse } = require("../../utils/ApiResponse.js");
const { uploadOnCloudinary } = require("../../utils/cloudinary.js");
const jwt = require("jsonwebtoken");
const {
    getSignedAccessUrl,
    uploadFile,
    deleteFileFromS3,
} = require("../../utils/s3Utils.js");
const { User } = require("../../models/userModel/user.model.js");
const { validateNumber, generateOTP } = require("../../utils/commonFunctions.js");
const { sendEmail } = require("../../utils/emailService.js");

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            return new ApiResponse(404, null, "User not found");
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        console.error("Error generating tokens:", error);
        return new ApiResponse(
            500,
            null,
            "Something went wrong while generating refresh and access tokens"
        );
    }
};

function validatePassword(password) {
    const errors = [];
    console.log(password, "00000000000000000000000");
    if (password?.length < 6 || password?.length > 10) {
        errors.push("Password must be 6-10 characters long");
    }

    if (!/[a-z]/.test(password)) {
        errors.push("Password must contain at least one lowercase letter");
    }

    if (!/[A-Z]/.test(password)) {
        errors.push("Password must contain at least one uppercase letter");
    }

    if (!/\d/.test(password)) {
        errors.push("Password must contain at least one digit");
    }

    if (!/[^a-zA-Z0-9]/.test(password)) {
        errors.push("Password must contain at least one special character");
    }

    if (errors.length > 0) {
        throw new ApiResponse(400, null, errors.join("; "));
    }

    return true;
}

const registerUser = asyncHandler(async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
        } = req.body;
        console.log('req.body: ', req.body);

        console.log(
            firstName,
            lastName,
            email,
            password,
            
        );
        try {
            validatePassword(password);
        } catch (error) {
            return res
                .status(400)
                .json(new ApiResponse(400, null, error.message));
        }

        if (
            [firstName, email, password].some(
                (field) => !field || field.trim() === ""
            )
        ) {
            return res
                .status(400)
                .json(
                    new ApiResponse(
                        400,
                        null,
                        "First name, email, and password are required"
                    )
                );
        }

        const existedUser = await User.findOne({ email });

        if (existedUser) {
            return res
                .status(409)
                .json(
                    new ApiResponse(409, null, "User with email already exists")
                );
        }

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password,
           
        });
        const createdUser = await User.findById(newUser._id).select(
            "-password -createdAt -updatedAt -__v"
        );

        if (!createdUser) {
            return res
                .status(500)
                .json(
                    new ApiResponse(
                        500,
                        null,
                        "Something went wrong while registering the user"
                    )
                );
        }

        return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    createdUser,
                    "User registered successfully"
                )
            );
    } catch (error) {
        console.error("Error registering user:", error);
        return res
            .status(500)
            .json(new ApiResponse(500, null, "Failed to register user"));
    }
});

const loginUser = asyncHandler(async (req, res) => {
    // return res
    // .status(401)
    // .json(new ApiResponse(401, null, "Email is required"))
    const { email, password } = req.body;
    console.log(' req.body: ',  req.body);
    if (!email) {
        return res
            .status(400)
            .json(new ApiResponse(400, null, "Email is required"));
    }
    const user = await User.findOne({ email });
    console.log('user: ', user);
    if (!user) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "User does not exist"));
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    console.log('isPasswordValid: ', isPasswordValid);
    if (!isPasswordValid) {
        return res
            .status(401)
            .json(new ApiResponse(401, null, "Invalid user credentials"));
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
        user._id
    );
    console.log("accessToken, refreshToken: ", accessToken, refreshToken);
    const loggedInUser = await User.findById(user._id) 
//     .populate({
//     path: 'addresses', 
//     model: 'Address', 
//     // select: '-__v -createdAt -updatedAt',
//   })
  .select(
        "-password -refreshToken -createdAt -updatedAt -__v -cart -wishlist -addresses"
    );
    if (loggedInUser.avatar) {
        loggedInUser.avatar = await getSignedAccessUrl(loggedInUser.avatar);
    }
    if (loggedInUser.coverImage) {
        loggedInUser.coverImage = await getSignedAccessUrl(loggedInUser.coverImage);
    }

    const options = {
        httpOnly: true,
        secure: true,
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

const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select(
        "-password -refreshToken -createdAt -updatedAt -__v"
    );
    if (!user) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "User not found"));
    }
    if (user.avatar) {
        user.avatar = await getSignedAccessUrl(user.avatar);
    }
    if (user.coverImage) {
        user.coverImage = await getSignedAccessUrl(user.coverImage);
    }
    return res
        .status(200)
        .json(new ApiResponse(200, user, "User details fetched successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1,
            },
        },
        {
            new: true,
        }
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
        return res
            .status(401)
            .json(new ApiResponse(401, null, "Unauthorized request"));
    }
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
        const user = await User.findById(decodedToken?._id);
        if (!user) {
            return res
                .status(401)
                .json(new ApiResponse(401, null, "Invalid refresh token"));
        }
        if (incomingRefreshToken !== user?.refreshToken) {
            return res
                .status(401)
                .json(
                    new ApiResponse(
                        401,
                        null,
                        "Refresh token is expired or used"
                    )
                );
        }
        const options = {
            httpOnly: true,
            secure: true,
        };
        const { accessToken, refreshToken } =
            await generateAccessAndRefreshTokens(user._id);
        console.log(
            "accessToken, newRefreshToken:666666666 ",
            accessToken,
            refreshToken
        );
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: refreshToken },
                    "Access token refreshed"
                )
            );
    } catch (error) {
        return res
            .status(401)
            .json(
                new ApiResponse(
                    401,
                    null,
                    error?.message || "Invalid refresh token"
                )
            );
    }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        validatePassword(newPassword);
    } catch (error) {
        return res.status(400).json(new ApiResponse(400, null, error.message));
    }
    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
        return res
            .status(400)
            .json(new ApiResponse(400, null, "Invalid old password"));
    }
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;
        const totalCount = await User.countDocuments({
            _id: { $ne: req.user._id },
        });

        const usersQuery = await User.find(
            { _id: { $ne: req.user._id }, userType: { $ne: "admin" } },
            "-password -stores -wishlist"
        )
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const usersData = {
            users: usersQuery,
            totalCount: totalCount,
        };
        res.status(200).json(
            new ApiResponse(200, usersData, "Users retrieved successfully")
        );
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Error fetching users" });
    }
});

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body;

    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email,
            },
        },
        { new: true }
    ).select("-password -createdAt -updatedAt -__v");

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Account details updated successfully")
        );
});

const updateUserAvatar = asyncHandler(async (req, res) => {
    console.log("req.file: ", req.file);
    const filePath = req.file?.path;
    const contentType = req.file?.mimetype;
    const originalName = req.file?.originalname;
    const userId = req.user._id;
    if (!filePath) {
        return res
            .status(400)
            .json(new ApiResponse(400, null, "Avatar file is missing"));
    }
    const s3FileName = `users/${userId}/avatar/${originalName}`;
    try {
        const currentUser = await User.findById(userId);

        if (!currentUser) {
            return res
                .status(404)
                .json(new ApiResponse(404, null, "User not found."));
        }

        if (currentUser.avatar) {
            await deleteFileFromS3(currentUser.avatar);
        }
        const response = await uploadFile(filePath, s3FileName, contentType);
        console.log("File uploaded successfully:", response);
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    avatar: s3FileName,
                },
            },
            { new: true }
        );
        if (updatedUser.avatar) {
            updatedUser.avatar = await getSignedAccessUrl(updatedUser.avatar);
        }
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { avatar: updatedUser.avatar },
                    "Avatar updated successfully."
                )
            );
    } catch (error) {
        console.error("Failed to upload file:", error);
        return res
            .status(500)
            .json(new ApiResponse(500, null, "Failed to update avatar."));
    }
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
    const filePath = req.file?.path;
    const contentType = req.file?.mimetype;
    const originalName = req.file?.originalname;
    const userId = req.user._id;
    if (!filePath) {
        return res
            .status(400)
            .json(new ApiResponse(400, null, "Avatar file is missing"));
    }
    const s3FileName = `users/${userId}/coverImage/${originalName}`;
    try {
        const currentUser = await User.findById(userId);

        if (!currentUser) {
            return res
                .status(404)
                .json(new ApiResponse(404, null, "User not found."));
        }

        if (currentUser.coverImage) {
            await deleteFileFromS3(currentUser.coverImage);
        }
        const response = await uploadFile(filePath, s3FileName, contentType);
        console.log("File uploaded successfully:", response);
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    coverImage: s3FileName,
                },
            },
            { new: true }
        );
        if (updatedUser.coverImage) {
            updatedUser.coverImage = await getSignedAccessUrl(updatedUser.coverImage);
        }
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { coverImage: updatedUser.coverImage },
                    "Avatar updated successfully."
                )
            );
    } catch (error) {
        console.error("Failed to upload file:", error);
        return res
            .status(500)
            .json(new ApiResponse(500, null, "Failed to update avatar."));
    }
});


// forgot by Otp
// const forgotPassword = asyncHandler(async (req, res) => {
//     try {
//         const { email } = req.body;
//         if(!email){
//             return res.status(404).json(new ApiResponse(404, null, 'Please add email inside the payload'));
//         }
//         const user = await User.findOne({ email });

//         if (!user) {
//             return res.status(404).json(new ApiResponse(404, null, 'User not found'));
//         }

//         const otp = generateOTP();
//         const otpExpiry = Date.now() + 10 * 60 * 1000;
//         user.forgotPasswordOTP = otp;
//         user.forgotPasswordOTPExpiry = otpExpiry;
//         await user.save();
//         await sendEmail({
//             to: email,
//             subject: 'Your Password Reset OTP',
//             html: `<p>Your OTP for password reset is: <strong>${otp}</strong></p>`,
//         });
//         res.status(200).json(new ApiResponse(200, null, 'OTP sent to email'));
//     } catch (error) {
//         res.status(500).json(new ApiResponse(500, null, error.message));
//     }
// });

// forgot by link 
const forgotPassword = asyncHandler(async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json(new ApiResponse(400, null, 'Email is required'));
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json(new ApiResponse(404, null, 'User not found'));
        }

        const otp = generateOTP();
        const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
        user.forgotPasswordOTPExpiry = otpExpiry;
        user.forgotPasswordOTP = otp;
        await user.save();
        // Create JWT token with OTP and email
        const token = jwt.sign({ email, otp }, process.env.hsbs_gmail_token_secret, { expiresIn: '10m' });

        // Send email with link containing token
        const resetLink = `http://localhost:4200/forgot-password?token=${token}&isEmailSubmitted=true`;
        await sendEmail({
            to: email,
            subject: 'Your Password Reset Link',
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
        });

        res.status(200).json(new ApiResponse(200, null, 'Password reset link sent to email'));
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json(new ApiResponse(500, null, 'Failed to send password reset link'));
    }
});

// verify by otp
// const verifyOTP = asyncHandler(async (req, res) => {
//     try {
//         const { email, otp, newPassword } = req.body;
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).json(new ApiResponse(404, null, 'User not found'));
//         }
//         if (Date.now() > user.forgotPasswordOTPExpiry) {
//             return res.status(400).json(new ApiResponse(400, null, 'OTP has expired'));
//         }
//         if (user.forgotPasswordOTP !== otp) {
//             return res.status(400).json(new ApiResponse(400, null, 'Invalid OTP'));
//         }
//         user.password = newPassword;
//         user.forgotPasswordOTP = undefined;
//         user.forgotPasswordOTPExpiry = undefined;
//         await user.save();
//         res.status(200).json(new ApiResponse(200, null, 'Password has been reset'));
//     } catch (error) {
//         res.status(500).json(new ApiResponse(500, null, error.message));
//     }
// });

// verify by link 
const verifyToken = asyncHandler(async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json(new ApiResponse(400, null, 'Token is required'));
        }

        // Decode token
        const decoded = jwt.verify(token, process.env.hsbs_gmail_token_secret);
        console.log('decoded: ', decoded);

        const { email, otp } = decoded;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json(new ApiResponse(404, null, 'User not found'));
        }

        if (user.forgotPasswordOTP !== otp || Date.now() > user.forgotPasswordOTPExpiry) {
            return res.status(400).json(new ApiResponse(400, null, 'Invalid or expired token'));
        }

        res.status(200).json(new ApiResponse(200, null, 'Token is valid'));
    } catch (error) {
        console.error('Verify token error:', error);
        res.status(500).json(new ApiResponse(500, null, 'Failed to verify token'));
    }
});


const resetPassword = asyncHandler(async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            return res.status(400).json(new ApiResponse(400, null, 'Token and new password are required'));
        }
        const decoded = jwt.verify(token, process.env.hsbs_gmail_token_secret);
        console.log('decoded: ', decoded);

        const { email, otp } = decoded;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json(new ApiResponse(404, null, 'User not found'));
        }

        if (user.forgotPasswordOTP !== otp || Date.now() > user.forgotPasswordOTPExpiry) {
            return res.status(400).json(new ApiResponse(400, null, 'Invalid or expired token'));
        }

        // Update password
        user.password = newPassword;
        user.forgotPasswordOTP = undefined;
        user.forgotPasswordOTPExpiry = undefined;
        await user.save();

        res.status(200).json(new ApiResponse(200, null, 'Password has been reset successfully'));
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json(new ApiResponse(500, null, 'Failed to reset password'));
    }
});


module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getAllUsers,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    forgotPassword,
    verifyToken,
    resetPassword
};
