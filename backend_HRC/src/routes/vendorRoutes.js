const express = require('express');
const { getVendorsByType } = require('../controllers/vendorController');

const router = express.Router();

router.get('/type/:type', getVendorsByType);

module.exports = router;
