require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { asyncHandler } = require("../../utils/asyncHandler.js");
const { ApiResponse } = require("../../utils/ApiResponse.js");
const { User } = require("../../models/userModel/user.model.js");
const { Order } = require("../../models/orderModel/order.Model.js");
const { generateAndUploadReceipt } = require("../../utils/receiptGenerator.js");
const { getSignedAccessUrl } = require("../../utils/s3Utils.js");


// const getOrderInvoice = asyncHandler(async (req, res) => {
//     const { orderId } = req.params; 
//     const userId = req.user._id.toString(); 

//     try {
//         const order = await Order.findById(orderId).populate('user');

//         if (!order) {
//             return res.status(404).json(new ApiResponse(404, null, "Order not found"));
//         }
//         if (order.user._id.toString() !== userId) {
//             return res.status(403).json(new ApiResponse(403, null, "Unauthorized access to this order"));
//         }
//         if (!order.invoiceUrl) {
//             return res.status(404).json(new ApiResponse(404, null, "Invoice not found for this order"));
//         }
//         // const invoicePath = order.invoiceUrl; 
//         const invoicePath = await getSignedAccessUrl(order.invoiceUrl)

//         // Respond with the path for viewing or downloading
//         res.status(200).json(new ApiResponse(200, { invoicePath }, "Invoice path retrieved successfully"));
//     } catch (error) {
//         console.error("Error in getOrderInvoice:", error);
//         res.status(500).json(new ApiResponse(500, null, "Failed to retrieve invoice"));
//     }
// });

const getOrderInvoice = asyncHandler(async (req, res) => {
    const { orderId } = req.params; 
    const userId = req.user._id.toString(); 

    try {
        const order = await Order.findById(orderId).populate('user');

        if (!order) {
            return res.status(404).json(new ApiResponse(404, null, "Order not found"));
        }
        if (order.user._id.toString() !== userId) {
            return res.status(403).json(new ApiResponse(403, null, "Unauthorized access to this order"));
        }
        if (!order.invoiceUrl) {
            return res.status(404).json(new ApiResponse(404, null, "Invoice not found for this order"));
        }
        const invoicePath = await getSignedAccessUrl(order.invoiceUrl);
        res.setHeader('Content-Disposition', 'attachment; filename="invoice.pdf"'); 
        res.setHeader('Content-Type', 'application/pdf');
        res.status(200).json(new ApiResponse(200, { invoicePath }, "Invoice path retrieved successfully"));
    } catch (error) {
        console.error("Error in getOrderInvoice:", error);
        res.status(500).json(new ApiResponse(500, null, "Failed to retrieve invoice"));
    }
});


const createCheckoutSession = asyncHandler(async (req, res) => {
    const userId = req.user._id.toString();
    try {
        if (!userId) {
            return res
                .status(400)
                .json(new ApiResponse(400, null, "Invalid user ID"));
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
        if (!user.cart.length) {
            return res
                .status(404)
                .json(new ApiResponse(404, null, "please add items to cart"));
        }
        const cartItems = user.cart.map((item) => ({
            product: item.product._id,
            name: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
            totalPrice: item.quantity * item.product.price,
        }));
        const totalAmount = cartItems.reduce(
            (sum, item) => sum + item.totalPrice,
            0
        );
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: cartItems.map((item) => ({
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: item.price * 100,
                },
                quantity: item.quantity,
            })),
            mode: "payment",
            success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/cart`,
            metadata: {
                userId: userId,
                cartItems: JSON.stringify(cartItems),
            },
        });

        res.status(200).json(
            new ApiResponse(
                200,
                { sessionId: session.id},
                "Checkout session created successfully"
            )
        );

    } catch (error) {
        console.error("Error in createCheckoutSession:", error);
        res.status(500).json(
            new ApiResponse(500, null, "Failed to create checkout session")
        );
    }
});

const handlePaymentWebhook = asyncHandler(async (req, res) => {
    try {
        const sig = req.headers["stripe-signature"];
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

        let event;
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

        console.log("Received event:", event.type);

        switch (event.type) {
            case "checkout.session.completed":
                await handleSessionCompleted(event);
                break;

            case "checkout.session.async_payment_succeeded":
                await handleAsyncPaymentSucceeded(event);
                break;

            case "checkout.session.async_payment_failed":
                await handleAsyncPaymentFailed(event);
                break;

            case "checkout.session.expired":
                console.log("Checkout session expired:", event.data.object.id);
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        res.status(200).json({ received: true });
    } catch (error) {
        console.error("Webhook error:", error.message);
        res.status(400).json({ error: `Webhook Error: ${error.message}` });
    }
});


const handleSessionCompleted = async (event) => {
    const session = event.data.object;
    console.log("Checkout session completed:", session);

    const user = await User.findById(session.metadata.userId).populate("addresses");
    if (!user) throw new Error("User not found");

    const defaultAddress = user.addresses.find((addr) => addr.isDefault);
    if (!defaultAddress) throw new Error("No default delivery address found");

    const cartItems = JSON.parse(session.metadata.cartItems);

    const newOrder = new Order({
        user: user._id,
        items: cartItems.map((item) => ({
            product: item.product,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
        })),
        deliveryAddress: defaultAddress._id,
        paymentDetails: {
            transactionId: session.id,
            amount: session.amount_total / 100,
            currency: session.currency,
            status: "completed",
        },
        orderStatus: "pending",
    });

    await newOrder.save();
    console.log("Order saved successfully:", newOrder._id);

    user.cart = [];
    await user.save();

    const invoiceUrl = await generateAndUploadReceipt(session);
    console.log('invoiceUrl: ', invoiceUrl);
    newOrder.invoiceUrl = invoiceUrl;
    await newOrder.save();

    console.log("Invoice uploaded and order updated:", invoiceUrl);
};


const handleAsyncPaymentSucceeded = async (event) => {
    const session = event.data.object;
    console.log("Async Payment Succeeded:", session.id);

    const order = await Order.findOne({ "paymentDetails.transactionId": session.id });
    if (!order) {
        console.error("Order not found for session:", session.id);
        return;
    }
     
    console.log('order:handleAsyncPaymentSucceeded ', order);
    order.paymentDetails.status = "completed";
    order.orderStatus = "confirmed";
    await order.save();

    console.log("Order status updated to confirmed:", order._id);
};

const handleAsyncPaymentFailed = async (event) => {
    const session = event.data.object;
    console.log("Async Payment Failed:", session.id);

    const order = await Order.findOne({ "paymentDetails.transactionId": session.id });
    if (!order) {
        console.error("Order not found for session:", session.id);
        return;
    }

    order.paymentDetails.status = "failed";
    order.orderStatus = "payment_failed";
    await order.save();

    console.log("Order status updated to payment_failed:", order._id);
};



module.exports = {
    createCheckoutSession,
    handlePaymentWebhook,
    getOrderInvoice
};
