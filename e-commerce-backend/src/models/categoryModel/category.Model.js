const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = new Schema(
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
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        subCategories: [
            {
                type: Schema.Types.ObjectId,
                ref: "SubCategory",
            },
        ],
        categoryImage: {
            type: String,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true }, 
        toObject: { virtuals: true },
    }
);

categorySchema.virtual("categoryImageimageUrl").get(function () {
    return this.categoryImage;
});

const Category = mongoose.model("Category", categorySchema);

module.exports = {
    Category,
};
