const { asyncHandler } = require("../../utils/asyncHandler.js");
const { ApiResponse } = require("../../utils/ApiResponse.js");
const { Category } = require("../../models/categoryModel/category.Model.js");
const { getSignedAccessUrl } = require("../../utils/s3Utils.js");

// Get all categories
const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find().select('-createdBy -createdAt -updatedAt -__v');
    const categoryObjects = await Promise.all(categories.map(async (category) => {
        // Convert each category document to a plain object
        const categoryObject = category.toObject({ virtuals: true });

        // Manually resolve the signed URL for category image
        categoryObject.categoryImageimageUrl = await getSignedAccessUrl(category.categoryImage);

        return categoryObject;
    }));
    res.status(200).json(
        new ApiResponse(200, categoryObjects, "Categories retrieved successfully")
    );
});

// Get single category by ID
const getCategoryById = asyncHandler(async (req, res) => {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId).select('-createdBy -createdAt -updatedAt -__v');
    console.log('category:Parag ', category);
    if (!category) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Category not found"));
    }
    res.status(200).json(
        new ApiResponse(200, category, "Category retrieved successfully")
    );
});

module.exports = {
    getAllCategories,
    getCategoryById,
};
