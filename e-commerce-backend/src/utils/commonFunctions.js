const { default: mongoose } = require("mongoose");
const { uploadFile, getSignedAccessUrl } = require("./s3Utils");

const handleFileUpload = async (files, userId, type) => {
    const uploadedFiles = [];
    await Promise.all(files.map(async (file) => {
        const filePath = `./src/uploads/${type}/${file.filename}`;
        const contentType = file.mimetype;
        const s3FileName = `products/${type}/${userId}/${file.filename}`;
        try {
            await uploadFile(filePath, s3FileName, contentType);
            uploadedFiles.push(s3FileName);
        } catch (error) {
            console.error(`Error uploading ${type} ${file.filename} to S3:`, error);
            throw new Error(`Error uploading ${type} ${file.filename} to S3`);
        }
    }));
    return uploadedFiles;
};

const getSignedUrls = async (files) => {
    return Promise.all(files.map(async (fileName) => {
        return await getSignedAccessUrl(fileName);
    }));
};

const validateQuantity = (quantity) => {
    if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new Error("Quantity must be a positive integer");
    }
};
const validateNumber = (num) => {
    if (!Number.isInteger(num)) {
        throw new Error(`${num} must be a Number Type`);
    }
};

const validateObjectId = (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid ID");
    }
};

const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

const validateUserId = (userId) => {
    if (!userId) {
        throw new Error("User not authenticated");
    }
};


module.exports = {
    handleFileUpload,
    getSignedUrls,
    validateQuantity,
    validateNumber,
    validateObjectId,
    generateOTP,
    validateUserId
}