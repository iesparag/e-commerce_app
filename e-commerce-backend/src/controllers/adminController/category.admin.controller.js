const { asyncHandler } = require("../../utils/asyncHandler.js");
const { ApiResponse } = require("../../utils/ApiResponse.js");
const { Category } = require("../../models/categoryModel/category.Model.js");
const {
    SubCategory,
} = require("../../models/subCategoryModel/subCategory.Model.js");
const { Product } = require("../../models/productModel/product.Model.js");
const { uploadFile, getSignedAccessUrl } = require("../../utils/s3Utils.js");

const createCategory = asyncHandler(async (req, res) => {
    console.log("req.file: ", req.body);
    const filePath = req.file?.path;
    const contentType = req.file?.mimetype;
    const originalName = req.file?.originalname;
    const s3FileName = `users/categories/${originalName}`;
    const { name, description } = req.body;
    const response = await uploadFile(filePath, s3FileName, contentType);
    console.log("response: ", response);

    const createdBy = req.user._id;

    const newCategory = new Category({
        name,
        description,
        createdBy,
        categoryImage: s3FileName,
    });

    const savedCategory = await newCategory.save();

    // Convert document to plain object
    const categoryObject = savedCategory.toObject({ virtuals: true });
    console.log('categoryObject: ', categoryObject);

    // Manually resolve signed URL
    categoryObject.categoryImageimageUrl = await getSignedAccessUrl(
        savedCategory.categoryImage
    );

    console.log("populatedCategory: ", categoryObject);

    res.status(201).json(
        new ApiResponse(201, categoryObject, "Category created successfully")
    );
});


const updateCategory = asyncHandler(async (req, res) => {
    const categoryId = req.params.id;
    const updates = req.body;
    const category = await Category.findByIdAndUpdate(categoryId, updates, {
        new: true,
        runValidators: true,
    });
    if (!category) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Category not found"));
    }
    return res
        .status(200)
        .json(new ApiResponse(200, category, "Category updated successfully"));
});

const deleteCategory = asyncHandler(async (req, res) => {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);
    if (!category) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Category not found"));
    }
    await SubCategory.deleteMany({ category: categoryId });
    await Product.deleteMany({ category: categoryId });
    await Category.findByIdAndDelete(categoryId);
    res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Category and associated data deleted successfully"
        )
    );
});

module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
};
