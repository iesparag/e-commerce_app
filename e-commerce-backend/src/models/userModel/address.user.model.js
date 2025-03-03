const mongoose = require("mongoose");
const { Schema } = mongoose;

const addressSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // This will link each address to a specific user
      required: true,
    },
    mainAddress: {
      type: String,
      required: true,
    },
    floor: {
      type: String,
    },
    building: {
      type: String,
    },
    street: {
      type: String,
    },
    locality: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
    zip: {
      type: String,
    },
    isDefault: {
      type: Boolean,
      default: false, // Mark the address as default
    },
  },
  {
    timestamps: true,
  }
);

// Address model based on the schema
const Address = mongoose.model("Address", addressSchema);

module.exports = { Address };
