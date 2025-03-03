const { Router } = require("express");
const router = Router();
const {
    getAllProducts,
    getProductById,
    searchProducts,
} = require("../../controllers/buyerController/product.buyer.controller");

router.get("/", getAllProducts);
router.get("/search", searchProducts);
router.get("/:id", getProductById);

module.exports = router;