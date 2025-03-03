const { asyncHandler } = require("../../utils/asyncHandler");
const { ApiResponse } = require("../../utils/ApiResponse");
const { Product } = require("../../models/productModel/product.Model");

// Get all products
const getAllProducts = asyncHandler(async (req, res) => {
    const { categoryId, subCategoryId } = req.query;
    let filter = {};
    if (categoryId && subCategoryId) {
        filter = { categoryId, subCategoryId };
    } else if (categoryId) {
        filter = { categoryId };
    }else if (subCategoryId) {
        filter = { subCategoryId };
    }
    let products;
    if (categoryId || subCategoryId) {
        products = await Product.find(filter);
    } else {
        products = await Product.find();
    }
    const productsWithUrls = await Promise.all(products.map(async (product) => {
        const imageUrls = await product.imageUrls;
        const videoUrls = await product.videoUrls;
        return {
           ...product.toObject(), 
            images: imageUrls, 
            videos: videoUrls, 
        };
    }));
    res.status(200).json({
        statusCode: 200,
        data: productsWithUrls, 
        message: "Products retrieved successfully",
        success: true,
    });
});

const getProductById = asyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
        return res
           .status(404)
           .json(new ApiResponse(404, null, "Product not found"));
    }
    const productWithUrls = {
       ...product.toObject(), 
        images: await product.imageUrls, 
        videos: await product.videoUrls,
    };

    res.status(200).json(
        new ApiResponse(200, productWithUrls, "Product retrieved successfully")
    );
});

const searchProducts = asyncHandler(async (req, res) => {
    const { query } = req.query;
    const searchQuery = query?.trim();

    if (!searchQuery) {
        return res
            .status(400)
            .json(new ApiResponse(400, null, "Query parameter is required"));
    }

    try {
        const products = await Product.find({
            $or: [
                { name: { $regex: searchQuery, $options: 'i' } },
                { description: { $regex: searchQuery, $options: 'i' } },
                { brand: { $regex: searchQuery, $options: 'i' } }
            ]
        });

        if (products.length === 0) {
            return res.status(404).json(new ApiResponse(404, null, "No products found"));
        }

        const productsWithUrls = await Promise.all(products.map(async (product) => {
            const imageUrls = await product.imageUrls;
            const videoUrls = await product.videoUrls;
            return {
                ...product.toObject(),
                images: imageUrls,
                videos: videoUrls,
            };
        }));

        res.status(200).json({
            statusCode: 200,
            data: productsWithUrls,
            message: "Products retrieved successfully",
            success: true,
        });
    } catch (error) {
        console.error("Error searching products:", error);
        res.status(500).json(new ApiResponse(500, null, "Internal server error"));
    }
});



module.exports = {
    getAllProducts,
    getProductById,
    searchProducts
};
