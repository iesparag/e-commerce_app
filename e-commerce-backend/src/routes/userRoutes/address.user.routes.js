const { Router } = require("express");
const router = Router();
const {
  addUserAddress,
  getUserAddresses,
  updateUserAddress,
  deleteUserAddress,
  setDefaultAddress,
} = require("../../controllers/users/address.user.controller.js");
const { verifyJWT } = require("../../middlewares/auth.middleware.js");

router.route("/add").post(verifyJWT, addUserAddress); // Add a new address
router.route("/").get(verifyJWT, getUserAddresses); // Get all addresses of the current user
router.route("/:addressId").patch(verifyJWT, updateUserAddress); // Update a specific address by ID
router.route("/:addressId").delete(verifyJWT, deleteUserAddress); // Delete a specific address by ID
router.route("/set-default/:addressId").patch(verifyJWT, setDefaultAddress); // Set a specific address as default

module.exports = router;
