const { Router } = require("express");
const router = Router();
const {
    getUserCart,
    addItemToCart,
    updateCartItemQuantity,
    removeItemFromCart,
    moveToWishlist,
    moveItemFromCartToSaveForLater,
    moveItemFromSaveForLaterToCart,
    getUserSaveForLater,
    deleteItemFromSaveForLater
} = require("../../controllers/buyerController/cart.buyer.controller");
const { verifyJWT } = require("../../middlewares/auth.middleware");

router.use(verifyJWT);
router.get("/", getUserCart);
router.get("/save-for-later", getUserSaveForLater);
router.post("/", addItemToCart);
router.post("/:productId", moveToWishlist);
router.patch("/", updateCartItemQuantity);
router.delete("/save-for-later/:productId", deleteItemFromSaveForLater);
router.delete("/:productId", removeItemFromCart);
router.patch("/move-item-from-cart-to-sav-for-later/:productId", moveItemFromCartToSaveForLater);
router.patch("/move-item-from-save-for-later-to-cart/:productId", moveItemFromSaveForLaterToCart);

module.exports = router;
