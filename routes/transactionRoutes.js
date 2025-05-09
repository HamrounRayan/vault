const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/blockchainController');

router.post('/', transactionController.transact);

module.exports = router;