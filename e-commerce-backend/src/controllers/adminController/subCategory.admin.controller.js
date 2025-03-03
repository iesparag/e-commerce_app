const { asyncHandler } = require("../../utils/asyncHandler.js");
const { ApiResponse } = require("../../utils/ApiResponse.js");
const {
    SubCategory,
} = require("../../models/subCategoryModel/subCategory.Model.js");
const { Category } = require("../../models/categoryModel/category.Model.js");
const { Product } = require("../../models/productModel/product.Model.js");
const { uploadFile, getSignedAccessUrl } = require("../../utils/s3Utils.js");

// Create a new subcategory
const createSubCategory = asyncHandler(async (req, res) => {
    const filePath = req.file?.path;
    const contentType = req.file?.mimetype;
    const originalName = req.file?.originalname;
    const s3FileName = `users/categories/${originalName}`
    const { name, description, categoryId } = req.body;
    const createdBy = req.user._id;
    const response = await uploadFile(filePath, s3FileName, contentType)
    const newSubCategory = new SubCategory({
        name,
        description,
        categoryId,
        createdBy,
        subCategoryImage: s3FileName
    });
    const savedCategory = await newSubCategory.save();

    const subCategoryObject = savedCategory.toObject({ virtuals: true });

    // Manually resolve signed URL
    subCategoryObject.subCategoryImageUrl = await getSignedAccessUrl(
        savedCategory.subCategoryImage
    );

    await Category.findByIdAndUpdate(categoryId, {
        $push: { subCategories: newSubCategory._id },
    });
    res.status(201).json(
        new ApiResponse(201, subCategoryObject, "SubCategory created successfully")
    );
});

// Update a subcategory
const updateSubCategory = asyncHandler(async (req, res) => {
    const subCategoryId = req.params.id;
    const updates = req.body;

    const subCategory = await SubCategory.findByIdAndUpdate(
        subCategoryId,
        updates,
        {
            new: true,
            runValidators: true,
        }
    );

    if (!subCategory) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "SubCategory not found"));
    }
    res.status(200).json(
        new ApiResponse(200, subCategory, "SubCategory updated successfully")
    );
});

const deleteSubCategory = asyncHandler(async (req, res) => {
    const subCategoryId = req.params.id;
    const subCategory = await SubCategory.findById(subCategoryId);
    if (!subCategory) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "SubCategory not found"));
    }
    await Category.findByIdAndUpdate(subCategory.categoryId, {
        $pull: { subCategories: subCategoryId },
    });
    await Product.deleteMany({ subCategory: subCategoryId });
    await SubCategory.findByIdAndDelete(subCategoryId);
    res.status(200).json(
        new ApiResponse(
            200,
            null,
            "SubCategory and associated products deleted successfully"
        )
    );
});

module.exports = {
    createSubCategory,
    updateSubCategory,
    deleteSubCategory,
};
