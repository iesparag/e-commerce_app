const { asyncHandler } = require("../../utils/asyncHandler.js");
const { ApiResponse } = require("../../utils/ApiResponse.js");
const { SubCategory } = require("../../models/subCategoryModel/subCategory.Model.js");
const { Category } = require("../../models/categoryModel/category.Model.js");
const { getSignedAccessUrl } = require("../../utils/s3Utils.js");

const getAllSubCategories = asyncHandler(async (req, res) => {
    const { name } = req.query;  // Fetch 'name' instead of categoryId from the query
    let filter = {};

    if (name) {
        // Find the categoryId using the category name
        const category = await Category.findOne({ name });

        if (!category) {
            return res.status(404).json(new ApiResponse(404, null, "Category not found"));
        }

        // Set the filter with the categoryId obtained
        filter = { categoryId: category._id };
    }

    // Fetch the subcategories based on the filter
    const subCategories = await SubCategory.find(filter)
        .select('-createdBy -createdAt -updatedAt -__v')
        .lean(); // To ensure the virtual field is included in the response

    // Add subCategoryImageUrl dynamically (this is done automatically via virtual field)
    for (let subCategory of subCategories) {
        subCategory.subCategoryImage = await getSignedAccessUrl(subCategory.subCategoryImage);
    }

    res.status(200).json(
        new ApiResponse(200, subCategories, "SubCategories retrieved successfully")
    );
});

// Get single subcategory by ID
const getSubCategoryById = asyncHandler(async (req, res) => {
    const subCategoryId = req.params.id;
    const subCategory = await SubCategory.findById(subCategoryId)
        .select('-createdBy -createdAt -updatedAt -__v')
        .lean(); // To include the virtual field

    if (!subCategory) {
        return res.status(404).json(new ApiResponse(404, null, "SubCategory not found"));
    }

    // Generate signed URL for the subCategory image
    subCategory.subCategoryImageUrl = await getSignedAccessUrl(subCategory.subCategoryImage);

    res.status(200).json(
        new ApiResponse(200, subCategory, "SubCategory retrieved successfully")
    );
});


module.exports = {
    getAllSubCategories,
    getSubCategoryById,
};
