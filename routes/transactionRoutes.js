const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/blockchainController');

router.post('/', transactionController.transact);
router.get('/history', transactionController.getBlockchain);

module.exports = router;