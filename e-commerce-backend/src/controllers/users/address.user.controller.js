const { asyncHandler } = require("../../utils/asyncHandler.js");
const { ApiError } = require("../../utils/ApiError.js");
const { ApiResponse } = require("../../utils/ApiResponse.js");
const { Address } = require("../../models/userModel/address.user.model.js");
const { User } = require("../../models/userModel/user.model.js");

const addUserAddress = asyncHandler(async (req, res) => {
    try {
        const {
            mainAddress,
            floor,
            building,
            street,
            locality,
            city,
            state,
            country,
            zip,
            isDefault,
        } = req.body;

        const userId = req.user._id;

        if (
            [
                mainAddress,
                floor,
                building,
                street,
                locality,
                city,
                state,
                country,
                zip,
            ].some((field) => !field || field.trim() === "")
        ) {
            return res
                .status(400)
                .json(
                    new ApiResponse(
                        400,
                        null,
                        "All address fields are required"
                    )
                );
        }

        // Check if it's the user's first address
        const user = await User.findById(userId);
        const isFirstAddress = user.addresses.length === 0;

        // Set the new address as default if it's the first address or if the user explicitly set it
        const addressToSave = new Address({
            userId,
            mainAddress,
            floor,
            building,
            street,
            locality,
            city,
            state,
            country,
            zip,
            isDefault: true, // First address or if explicitly set to true
        });

        // Save the new address
        const savedAddress = await addressToSave.save();

        // If this is not the first address, set all existing addresses to not default
        if (!isFirstAddress) {
            await Address.updateMany(
                { _id: { $ne: savedAddress._id }, userId }, // Update all addresses except the new one
                { $set: { isDefault: false } }
            );
        }

        // Update the user's address list with the new address
        await User.findByIdAndUpdate(userId, {
            $push: { addresses: savedAddress._id },
        });

        // Return success response
        return res
            .status(201)
            .json(
                new ApiResponse(201, savedAddress, "Address added successfully")
            );
    } catch (error) {
        console.error("Error adding address:", error);
        return res
            .status(500)
            .json(new ApiResponse(500, null, "Failed to add address"));
    }
});


const getUserAddresses = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;

        const addresses = await Address.find({ userId }).sort({ createdAt: -1 });

        if (!addresses || addresses.length === 0) {
            return res
                .status(404)
                .json(
                    new ApiResponse(
                        404,
                        null,
                        "No addresses found for this user"
                    )
                );
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    addresses,
                    "Addresses fetched successfully"
                )
            );
    } catch (error) {
        console.error("Error fetching addresses:", error);
        return res
            .status(500)
            .json(new ApiResponse(500, null, "Failed to fetch addresses"));
    }
});

const updateUserAddress = asyncHandler(async (req, res) => {
    try {
        const { addressId } = req.params;
        const {
            mainAddress,
            floor,
            building,
            street,
            locality,
            city,
            state,
            country,
            zip,
            isDefault,
        } = req.body;

        // Find the address by ID
        const address = await Address.findById(addressId);

        if (!address) {
            return res
                .status(404)
                .json(new ApiResponse(404, null, "Address not found"));
        }

        // Update address fields
        address.mainAddress = mainAddress || address.mainAddress;
        address.floor = floor || address.floor;
        address.building = building || address.building;
        address.street = street || address.street;
        address.locality = locality || address.locality;
        address.city = city || address.city;
        address.state = state || address.state;
        address.country = country || address.country;
        address.zip = zip || address.zip;
        address.isDefault =
            isDefault !== undefined ? isDefault : address.isDefault;

        // Save the updated address
        const updatedAddress = await address.save().sort({ createdAt: -1 });

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    updatedAddress,
                    "Address updated successfully"
                )
            );
    } catch (error) {
        console.error("Error updating address:", error);
        return res
            .status(500)
            .json(new ApiResponse(500, null, "Failed to update address"));
    }
});

const deleteUserAddress = asyncHandler(async (req, res) => {
    try {
        const { addressId } = req.params;

        // Find and delete the address by ID
        const deletedAddress = await Address.findByIdAndDelete(addressId);

        if (!deletedAddress) {
            return res
                .status(404)
                .json(new ApiResponse(404, null, "Address not found"));
        }

        await User.findByIdAndUpdate(req.user._id, {
            $pull: { addresses: addressId },
        });

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Address deleted successfully"));
    } catch (error) {
        console.error("Error deleting address:", error);
        return res
            .status(500)
            .json(new ApiResponse(500, null, "Failed to delete address"));
    }
});

const setDefaultAddress = asyncHandler(async (req, res) => {
    try {
        const { addressId } = req.params;

        const address = await Address.findById(addressId);

        if (!address) {
            return res
                .status(404)
                .json(new ApiResponse(404, null, "Address not found"));
        }

        await Address.updateMany(
            { userId: req.user._id, _id: { $ne: addressId } },
            { $set: { isDefault: false } }
        );

        address.isDefault = true;
        await address.save();

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    address,
                    "Default address updated successfully"
                )
            );
    } catch (error) {
        console.error("Error setting default address:", error);
        return res
            .status(500)
            .json(new ApiResponse(500, null, "Failed to set default address"));
    }
});

module.exports = {
    addUserAddress,
    getUserAddresses,
    updateUserAddress,
    deleteUserAddress,
    setDefaultAddress,
};
