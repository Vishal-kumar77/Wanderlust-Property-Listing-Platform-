const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


// we are trying to config means connecting both cludinary and our backend server
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
})

// Defining storage for cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',// we specify our folder name  where we want to store our files inside cloudinary
    allowedformat: ["png", "jpg", "jpeg", "pdf", "avif"],// we specify the type of files we want to store inside our folder
    format: async (req, file) => 'webp'
  },
});


module.exports = { cloudinary, storage }