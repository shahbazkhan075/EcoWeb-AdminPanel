import express from 'express';
import { upload } from '../config/cloudinaryConfig.js';
import { createProduct, deleteProduct, getAllProducts, updateProduct } from '../controllers/productController.js';

const router = express.Router();

router.post('/create', upload.single('image'), createProduct);
router.put('/update/:id', upload.single('image'), updateProduct);
router.delete('/delete/:id', deleteProduct);
router.get('/', getAllProducts);

export default router;