const { asyncHandler } = require("../utils/asyncHandler.js");
const { ApiResponse } = require("../utils/ApiResponse.js");

const checkRole = (role) => {
    return asyncHandler((req, res, next) => {
        if (req.user.role !== role) {
            console.log('req.user.role: ', req.user.role);
            return res.status(403).json(new ApiResponse(403, null, "Access denied"));
        }
        next();
    });
};

module.exports = {
    checkRole,
};
