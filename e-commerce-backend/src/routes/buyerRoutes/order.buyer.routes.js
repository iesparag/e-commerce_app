const { Router } = require("express");
const router = Router();
const {
    getAllOrders,
    getOrderById,
} = require("../../controllers/buyerController/order.buyer.controller");

router.get("/", getAllOrders);
router.get("/:id", getOrderById);

module.exports = router;
