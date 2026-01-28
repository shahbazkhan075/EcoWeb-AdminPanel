import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      min: [0, 'Price cannot be negative']
    },
    category: {
      type: String,
      required: [true, 'Please provide product category'],
      enum: ['Organic Food', 'Eco-Friendly', 'Food', 'Sustainable', 'Home', 'Other']
    },
    image: {
      public_id: {
        type: String
      },
      url: {
        type: String
      }
    },
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      default: 0,
      min: [0, 'Stock cannot be negative']
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Product', productSchema);
