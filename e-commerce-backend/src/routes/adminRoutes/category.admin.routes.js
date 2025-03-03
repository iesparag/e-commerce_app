const { Router } = require("express");
const router = Router();
const {
    createCategory,
    updateCategory,
    deleteCategory,
} = require("../../controllers/adminController/category.admin.controller");
const { verifyJWT } = require("../../middlewares/auth.middleware");
const { checkRole } = require("../../middlewares/roleMiddleware");
const { upload } = require("../../middlewares/multer.middleware");
router.use(verifyJWT, checkRole("admin"));

router.post("/", upload.single("categoryImage"), createCategory);
router.patch("/:id", updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
