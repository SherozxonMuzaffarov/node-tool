const mongoose = require('mongoose');

// Define Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  daysRemaining: Number,
  receiver_name: String,
  receiver_image: String,
  returned_date: Date,
  is_returned: Boolean,
},{
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
