import cloudinary from 'cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config();
const cloudinaryV2 = cloudinary.v2;

// Cloudinary configuration
cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer storage configuration (temporary storage)
const storage = multer.memoryStorage();

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, png, gif, webp)'), false);
  }
};

// Multer upload configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Cloudinary upload function
const uploadToCloudinary = async (fileBuffer, fileName) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinaryV2.uploader.upload_stream(
      {
        folder: 'appzeto/products',
        resource_type: 'auto',
        public_id: `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            public_id: result.public_id,
            url: result.secure_url
          });
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

// Cloudinary delete function
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinaryV2.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error('Error deleting file from Cloudinary: ' + error.message);
  }
};

export { upload, uploadToCloudinary, deleteFromCloudinary, cloudinaryV2 as cloudinary };
