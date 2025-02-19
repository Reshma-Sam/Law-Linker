const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


// Cloudinary Storage Configuration
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "Evidence", // This will store files inside Cloudinary in an "Evidence" folder
        format: async (req, file) => {
            const allowedFormats = ["jpeg", "jpg", "png", "pdf", "mp4", "mp3"];
            const ext = file.mimetype.split("/")[1];
            if (allowedFormats.includes(ext)) {
                return ext;
            }
            throw new Error("Invalid file type");
        },
        public_id: (req, file) => `${Date.now()}-${file.originalname}`
    },
});

// Initialize Multer
const upload = multer({ storage });

module.exports =  { upload }
