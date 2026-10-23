const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.Mixed },
  productId: { type: mongoose.Schema.Types.Mixed },
  title: { type: String, required: true },
  sanskritTitle: { type: String, default: '' },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  size: { type: String, default: 'L' },
  color: { type: String, default: 'Black' },
  image: { type: String, default: '' }
}, { _id: false });

const trackingUpdateSchema = new mongoose.Schema({
  status: { type: String, required: true },
  location: { type: String, default: 'National Sorting Hub' },
  description: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true }
  },
  items: [orderItemSchema],
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Processing', 'Dispatched', 'In Transit', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  currentLocation: {
    type: String,
    default: 'Brahmman Central Fulfillment Hub, New Delhi'
  },
  transitNote: {
    type: String,
    default: 'Order placed, pending admin confirmation'
  },
  courier: {
    name: { type: String, default: 'Bluedart Express' },
    trackingNumber: { type: String, default: () => `BD-${Math.floor(1000000 + Math.random() * 9000000)}` },
    expectedDelivery: {
      type: Date,
      default: () => new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    }
  },
  trackingHistory: [trackingUpdateSchema],
  paymentMethod: { type: String, default: 'UPI' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
