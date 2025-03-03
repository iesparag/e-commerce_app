const { Router } = require("express");
const express = require('express');
const bodyParser = require("body-parser");
const router = Router();
const {
    createCheckoutSession,
    handlePaymentWebhook,
    getOrderInvoice,
} = require("../../controllers/buyerController/payment.buyer.controller");
const { verifyJWT } = require("../../middlewares/auth.middleware");

// router.use(verifyJWT);


router.post("/create-checkout-session", verifyJWT, createCheckoutSession); // Update route for checkout session
router.get("/order/:orderId/invoice", verifyJWT, getOrderInvoice);

module.exports = router;
