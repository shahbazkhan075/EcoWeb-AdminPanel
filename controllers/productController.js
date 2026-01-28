import Product from '../models/Product.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinaryConfig.js';



export const createProduct = async (req, res, next) => {
    try {
        // form-data FIX
        const name = req.body?.name;
        const description = req.body?.description;
        const price = req.body?.price;
        const category = req.body?.category;
        const stock = req.body?.stock;

        console.log("hii")
        console.log(name, description, price, category);

        // Validation
        if (!name || !description || !price || !category) {
            return res.status(400).json({
                success: false,
                message: 'All required fields are mandatory'
            });
        }

        let imageData = {};

        // Image upload
        if (req.file) {
            const result = await uploadToCloudinary(
                req.file.buffer,
                req.file.originalname
            );

            imageData = {
                public_id: result.public_id,
                url: result.secure_url || result.url
            };
        }


        // Create product
        const product = await Product.create({
            name,
            description,
            price: Number(price),
            category,
            stock: stock ? Number(stock) : 0,
            image: imageData
        });

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product
        });
    } catch (error) {
        next(error);
    }
};


// Get All Products
export const getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find();

        res.status(200).json({
            success: true,
            count: products.length,
            products
        });
    } catch (error) {
        next(error);
    }
};

// Get Product by ID
export const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        next(error);
    }
};

// Update Product
export const updateProduct = async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        const { name, description, price, category, stock } = req.body;

        // Update fields
        if (name) product.name = name;
        if (description) product.description = description;
        if (price) product.price = price;
        if (category) product.category = category;
        if (stock !== undefined) product.stock = stock;

        // Handle image update
        if (req.file) {
            try {
                // Delete old image if exists
                if (product.image?.public_id) {
                    await deleteFromCloudinary(product.image.public_id);
                }
                // Upload new image
                const imageData = await uploadToCloudinary(req.file.buffer, req.file.originalname);
                product.image = imageData;
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Error updating image: ' + error.message
                });
            }
        }

        await product.save();

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            product
        });
    } catch (error) {
        next(error);
    }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // DELETE IMAGE FROM CLOUDINARY
        if (product.image?.public_id) {
            await deleteFromCloudinary(product.image.public_id);
        }

        await product.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
