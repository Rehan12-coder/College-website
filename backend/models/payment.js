const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  transactionId: {
    type: String,
    unique: true
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'bank_transfer', 'jazzcash', 'easypaisa'],
    required: true
  },
  paymentDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);