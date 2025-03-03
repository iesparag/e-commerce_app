const { asyncHandler } = require("../../utils/asyncHandler.js");
const { ApiResponse } = require("../../utils/ApiResponse.js");
const { User } = require("../../models/userModel/user.model.js");
const {
    validateQuantity,
    validateObjectId,
    validateUserId,
} = require("../../utils/commonFunctions.js");
const { Product } = require("../../models/productModel/product.Model.js");

const getUserCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    try {
        validateUserId(userId);
    } catch (error) {
        return res.status(400).json(new ApiResponse(400, null, error.message));
    }

    const user = await User.findById(userId).populate({
        path: "cart.product",
        model: "Product",
    });
    if (!user) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "User not found"));
    }

    const cartItems = await Promise.all(
        user.cart.map(async (item) => {
            const product = item.product;
            if (!product) {
                return null;
            }
            const imageUrls = await product.imageUrls;
            const videoUrls = await product.videoUrls;
            console.log("product: ", product);
            const productData = {
                productId: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                images: imageUrls,
                videos: videoUrls,
            };
            return {
                product: productData,
                quantity: item.quantity,
            };
        })
    );

    res.status(200).json(
        new ApiResponse(200, cartItems, "Cart retrieved successfully")
    );
});

const getUserSaveForLater = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    try {
        validateUserId(userId); // Validate the user ID
    } catch (error) {
        return res.status(400).json(new ApiResponse(400, null, error.message));
    }

    const user = await User.findById(userId).populate({
        path: "saveForLater",
        model: "Product",
    });

    if (!user) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "User not found"));
    }

    const saveForLaterItems = await Promise.all(
        user.saveForLater.map(async (product) => {
            if (!product) {
                return null;
            }
            const imageUrls = await product.imageUrls;
            const videoUrls = await product.videoUrls;
            return {
                productId: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                images: imageUrls, // Assuming `imageUrls` is an array
                videos: videoUrls, // Assuming `videoUrls` is an array
            };
        })
    );

    // Filter out any null values (just in case)
    const filteredItems = saveForLaterItems.filter((item) => item !== null);

    res.status(200).json(
        new ApiResponse(
            200,
            filteredItems,
            "Save For Later list retrieved successfully"
        )
    );
});

const addItemToCart = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user._id;
    try {
        validateQuantity(quantity);
        validateObjectId(productId);
        validateUserId(userId);
    } catch (error) {
        return res.status(400).json(new ApiResponse(400, null, error.message));
    }

    const user = await User.findById(userId);
    if (!user) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "User not found"));
    }

    let product = await Product.findById(productId);
    if (!product) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Product not found"));
    }

    const productIndex = user.cart.findIndex(
        (item) => item.product.toString() === productId
    );
    if (productIndex >= 0) {
        user.cart[productIndex].quantity += quantity;
    } else {
        user.cart.push({ product: productId, quantity });
    }
    await user.save();

    const imageUrls = await product.imageUrls;
    const videoUrls = await product.videoUrls;

    const updatedCartItem = {
        product: {
            productId: product._id,
            name: product.name,
            description: product.description,
            price: product.price,
            images: imageUrls,
            videos: videoUrls,
        },
        quantity:
            user.cart[productIndex >= 0 ? productIndex : user.cart.length - 1]
                .quantity,
    };
    res.status(200).json(
        new ApiResponse(200, updatedCartItem, "Item added to cart successfully")
    );
});

const removeItemFromCart = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const userId = req.user._id;
    try {
        validateObjectId(productId);
        validateUserId(userId);
    } catch (error) {
        return res.status(400).json(new ApiResponse(400, false, error.message));
    }

    const user = await User.findById(userId);
    if (!user) {
        return res
            .status(404)
            .json(new ApiResponse(404, false, "User not found"));
    }

    const productIndex = user.cart.findIndex(
        (item) => item.product.toString() === productId
    );
    if (productIndex >= 0) {
        const removedProduct = user.cart.splice(productIndex, 1)[0];
        await user.save();

        const product = await Product.findById(removedProduct.product);
        if (!product) {
            return res
                .status(404)
                .json(new ApiResponse(404, false, "Product not found"));
        }

        const imageUrls = await product.imageUrls;
        const videoUrls = await product.videoUrls;

        const response = new ApiResponse(
            200,
            {
                product: {
                    productId: product._id,
                    name: product.name,
                    price: product.price,
                    description: product.description,
                    images: imageUrls,
                    videos: videoUrls,
                },
                quantity: removedProduct.quantity,
            },
            "Item removed from cart successfully"
        );
        res.status(200).json(response);
    } else {
        return res
            .status(404)
            .json(new ApiResponse(404, false, "Product not found in cart"));
    }
});

const updateCartItemQuantity = asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user._id;
    console.log("userId: ", userId);

    try {
        validateQuantity(quantity);
        validateObjectId(productId);
        validateUserId(userId);
    } catch (error) {
        return res.status(400).json(new ApiResponse(400, null, error.message));
    }

    const user = await User.findById(userId);
    if (!user) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "User not found"));
    }

    const productIndex = user.cart.findIndex(
        (item) => item.product.toString() === productId
    );
    if (productIndex >= 0) {
        user.cart[productIndex].quantity = quantity;
    } else {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Product not found in cart"));
    }
    await user.save();

    const product = await Product.findById(productId);
    if (!product) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Product not found"));
    }

    const imageUrls = await product.imageUrls;
    const videoUrls = await product.videoUrls;

    const response = new ApiResponse(
        200,
        {
            product: {
                productId: product._id,
                name: product.name,
                price: product.price,
                description: product.description,
                images: imageUrls,
                videos: videoUrls,
            },
            quantity: user.cart[productIndex].quantity,
        },
        "Quantity updated successfully"
    );

    res.status(200).json(response);
});

const moveToWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const userId = req.user._id;
    try {
        validateObjectId(productId);
        validateUserId(userId);
    } catch (error) {
        return res.status(400).json(new ApiResponse(400, null, error.message));
    }

    const user = await User.findById(userId);
    if (!user) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "User not found"));
    }

    const productIndexInCart = user.cart.findIndex(
        (item) => item.product.toString() === productId
    );
    if (productIndexInCart < 0) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Product not found in cart"));
    }

    const itemQuantity = user.cart[productIndexInCart].quantity;
    user.cart.splice(productIndexInCart, 1);

    const productExistsInWishlist = user.wishlist.some(
        (item) => item.toString() === productId
    );
    if (!productExistsInWishlist) {
        user.wishlist.push(productId);
    }
    await user.save();

    const product = await Product.findById(productId);
    if (!product) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Product not found"));
    }

    const imageUrls = await product.imageUrls;
    const videoUrls = await product.videoUrls;

    const response = new ApiResponse(
        200,
        {
            product: {
                productId: product._id,
                name: product.name,
                price: product.price,
                description: product.description,
                images: imageUrls,
                videos: videoUrls,
            },
            quantity: itemQuantity,
        },
        "Item moved to wishlist successfully"
    );

    res.status(200).json(response);
});

const moveItemFromCartToSaveForLater = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const userId = req.user._id;

    try {
        // Validate IDs
        validateObjectId(productId);
        validateUserId(userId);
    } catch (error) {
        return res.status(400).json(new ApiResponse(400, null, error.message));
    }

    // Find the user and populate the cart products
    const user = await User.findById(userId).populate({
        path: "cart.product",
        options: { toJSON: { virtuals: true } }, // Include virtual fields
    });

    if (!user) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "User not found"));
    }

    // Find product in the user's cart
    const productIndexInCart = user.cart.findIndex(
        (item) => item.product._id.toString() === productId
    );
    if (productIndexInCart < 0) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Product not found in cart"));
    }

    // Get the product and quantity
    const item = user.cart[productIndexInCart];
    const { product, quantity } = item;

    // Remove product from cart
    user.cart.splice(productIndexInCart, 1);

    // Add product to saveForLater if it's not already there
    if (!user.saveForLater.includes(productId)) {
        user.saveForLater.push(productId);
    }

    // Save user changes
    await user.save();

    // Prepare response data
    const response = new ApiResponse(
        200,
        {
            product: {
                productId: product._id,
                name: product.name,
                price: product.price,
                priceAfterDiscount: product.priceAfterDiscount, // Include discount if applicable
                description: product.description,
                images: await product.imageUrls, // Virtual field
                videos: await product.videoUrls, // Virtual field
            },
            quantity,
        },
        "Item moved to save for later successfully"
    );

    // Send response
    return res.status(200).json(response);
});


const moveItemFromSaveForLaterToCart = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const userId = req.user._id;

    try {
        // Validate object and user IDs
        validateObjectId(productId);
        validateUserId(userId);
    } catch (error) {
        return res.status(400).json(new ApiResponse(400, null, error.message));
    }

    // Find the user and populate the saveForLater products
    const user = await User.findById(userId).populate({
        path: "saveForLater",
        options: { toJSON: { virtuals: true } }, // Include virtual fields
    });

    if (!user) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "User not found"));
    }

    // Find product in the saveForLater array
    const productIndexInSaveForLater = user.saveForLater.findIndex(
        (item) => item._id.toString() === productId
    );
    if (productIndexInSaveForLater < 0) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Product not found in save for later"));
    }

    // Get the product from saveForLater
    const product = user.saveForLater[productIndexInSaveForLater];

    // Remove the product from saveForLater
    user.saveForLater.splice(productIndexInSaveForLater, 1);

    // Add product to the cart (with default quantity of 1 if not already in cart)
    const cartIndex = user.cart.findIndex(
        (item) => item.product.toString() === productId
    );
    if (cartIndex < 0) {
        user.cart.push({ product: productId, quantity: 1 });
    } else {
        user.cart[cartIndex].quantity += 1; // Increase quantity if already in cart
    }

    // Save the user with updated cart and saveForLater
    await user.save();

    // Prepare the response with virtualized product data
    const response = new ApiResponse(
        200,
        {
            product: {
                productId: product._id,
                name: product.name,
                price: product.price,
                priceAfterDiscount: product.priceAfterDiscount, // Include discount if applicable
                description: product.description,
                images: await product.imageUrls, // Virtualized field
                videos: await product.videoUrls, // Virtualized field
            },
            quantity: 1, // Default quantity when moving from save for later to cart
        },
        "Item moved to cart successfully"
    );

    // Send the response back to the client
    return res.status(200).json(response);
});



const deleteItemFromSaveForLater = asyncHandler(async (req, res) => {
    const userId = req.user._id; // User ID from authentication middleware
    const { productId } = req.params; // Product ID from route params

    try {
        // Validate the IDs
        validateUserId(userId);
        validateObjectId(productId);

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json(new ApiResponse(404, null, "User not found"));
        }

        // Check if the product exists in the saveForLater array
        const productIndex = user.saveForLater.findIndex(
            (item) => item.toString() === productId
        );

        if (productIndex === -1) {
            return res
                .status(404)
                .json(new ApiResponse(404, null, "Product not found in save for later"));
        }

        // Remove the product from the saveForLater array
        user.saveForLater.splice(productIndex, 1);

        // Save the updated user document
        await user.save();

        // Send success response
        res.status(200).json(
            new ApiResponse(200, { productId }, "Item removed from save for later successfully")
        );
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, error.message));
    }
});


module.exports = {
    getUserCart,
    getUserSaveForLater,
    addItemToCart,
    removeItemFromCart,
    updateCartItemQuantity,
    moveToWishlist,
    moveItemFromSaveForLaterToCart,
    moveItemFromCartToSaveForLater,
    deleteItemFromSaveForLater
};
