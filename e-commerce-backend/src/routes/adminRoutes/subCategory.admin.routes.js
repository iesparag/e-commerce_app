const { Router } = require("express");
const {
    createSubCategory,
    updateSubCategory,
    deleteSubCategory,
} = require("../../controllers/adminController/subCategory.admin.controller");
const { verifyJWT } = require("../../middlewares/auth.middleware.js");
const { checkRole } = require("../../middlewares/roleMiddleware");
const { upload } = require("../../middlewares/multer.middleware.js");
const router = Router();

// Apply middlewares
router.use(verifyJWT, checkRole("admin"));

router.post("/", upload.single("subCategoryImage"), createSubCategory);
router.patch("/:id", updateSubCategory);
router.delete("/:id", deleteSubCategory);

module.exports = router;
