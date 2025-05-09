const Block = require('../models/Block');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const mongoose = require('mongoose');

const calculateHash = (index, timestamp, transactions, previousHash) => {
  return require('crypto')
    .createHash('sha256')
    .update(index + timestamp + JSON.stringify(transactions) + previousHash)
    .digest('hex');
};

exports.transact = async (req, res) => {
  const { to, amount } = req.body;
  const token = req.headers.authorization.split(' ')[1];
  
  try {
    // Verify sender
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    const fromUser = await User.findById(decoded.userId);
    if (!fromUser) return res.status(404).json({ error: "Sender not found" });

    // Find receiver
    const toUser = await User.findOne({ username: to });
    if (!toUser) return res.status(404).json({ error: "Receiver not found" });

    // Validate balance
    if (fromUser.balance < amount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // Get last block
    const latestBlock = await Block.findOne().sort({ index: -1 });

    // Create new block
    const newBlock = new Block({
      index: latestBlock ? latestBlock.index + 1 : 0,
      transactions: [{
        from: fromUser.username,
        to: toUser.username,
        amount: amount
      }],
      previousHash: latestBlock ? latestBlock.hash : '0'
    });

    newBlock.hash = calculateHash(
      newBlock.index,
      newBlock.timestamp,
      newBlock.transactions,
      newBlock.previousHash
    );

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await fromUser.updateOne({ $inc: { balance: -amount } }, { session });
      await toUser.updateOne({ $inc: { balance: amount } }, { session });
      await newBlock.save({ session });
      
      await session.commitTransaction();
      res.json({ message: "Transaction successful", block: newBlock });
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBlockchain = async (req, res) => {
  try {
    const chain = await Block.find().sort({ index: 1 });
    res.json(chain);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};