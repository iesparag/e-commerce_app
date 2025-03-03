const mongoose = require("mongoose");
const { Schema } = mongoose;

const subCategorySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        subCategoryImage: {
            type: String,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

subCategorySchema.virtual("subCategoryImageUrl").get(function () {
    return this.subCategoryImage;
});

const SubCategory = mongoose.model("SubCategory", subCategorySchema);

module.exports = {
    SubCategory,
};
