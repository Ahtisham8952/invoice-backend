const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  tin: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  customerNumber: {
    type: String,
    required: true
  },
  customerName: {
    type: String
  },
  serviceType: {
    type: String,
    required: true
  },
  referenceNumber: {
    type: String,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  otherFees: {
    type: Number,
    default: 0
  },
  vatAmount: {
    type: Number,
    default: 0
  },
  stampFee: {
    type: Number,
    default: 0
  },
  showStamp: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Invoice', invoiceSchema);
