const mongoose = require('mongoose');

const blockSchema = new mongoose.Schema({
  index: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  transactions: [
    {
      from: { type: String, required: true },
      to: { type: String, required: true },
      amount: { type: Number, required: true }
    }
  ],
  previousHash: { type: String, required: true },
  hash: { type: String, required: true },
});

module.exports = mongoose.model('Block', blockSchema);