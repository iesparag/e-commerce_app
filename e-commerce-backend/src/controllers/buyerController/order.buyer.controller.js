const { asyncHandler } = require("../../utils/asyncHandler");
const { ApiResponse } = require("../../utils/ApiResponse");
const { Order } = require("../../models/orderModel/order.Model");
const { default: mongoose } = require("mongoose");
const { getSignedAccessUrl } = require("../../utils/s3Utils");

// Get all orders
const getAllOrders = asyncHandler(async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("items.product", "name price")
            .populate("deliveryAddress", "street city state zipCode");

        if (!orders) {
            return res.status(404).json(new ApiResponse(404, null, "No orders found"));
        }

        res.status(200).json(new ApiResponse(200, orders, "Orders retrieved successfully"));
    } catch (error) {
        console.error(error);
        return res.status(500).json(new ApiResponse(500, null, "Internal server error"));
    }
});


// Get order by ID
const getOrderById = asyncHandler(async (req, res) => {
    const orderIdOrTransactionId = req.params.id;
    let order = null;

    if (mongoose.Types.ObjectId.isValid(orderIdOrTransactionId)) {
        order = await Order.findById(orderIdOrTransactionId)
            .populate("user", "name email")
            .populate({
                path: "items.product",
                select: "name brand images price",
            })
            .populate("deliveryAddress", "street city state zipCode");
    }

    if (!order) {
        order = await Order.findOne({ "paymentDetails.transactionId": orderIdOrTransactionId })
            .populate("user", "name email")
            .populate({
                path: "items.product",
                select: "name brand images price",
            })
            .populate("deliveryAddress", "mainAddress floor building street locality city state zipCode ");
    }

    if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
    }

    // **Generate Signed URLs for Each Product**
    const updatedItems = await Promise.all(
        order.items.map(async (item) => {
            if (item.product && item.product.images) {
                const signedUrls = await Promise.all(
                    item.product.images.map(async (image) => await getSignedAccessUrl(image))
                );

                return {
                    ...item.toObject(),
                    product: {
                        ...item.product.toObject(),
                        images: signedUrls, // Replace images with AWS signed URLs
                    },
                };
            }
            return item;
        })
    );
     if (order.invoiceUrl) {
            order.invoiceUrl = await getSignedAccessUrl(order.invoiceUrl);
        }

    // **Update Order Response**
    const updatedOrder = {
        ...order.toObject(),
        items: updatedItems,
    };

    res.status(200).json({ success: true, data: updatedOrder, message: "Order retrieved successfully" });
});


module.exports = {
    getAllOrders,
    getOrderById,
};
