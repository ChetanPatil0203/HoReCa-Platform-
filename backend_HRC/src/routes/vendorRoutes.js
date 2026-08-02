const express = require('express');
const {
  getVendorsByType,
  getOfferedServices,
  createOfferedService,
  updateOfferedService,
  deleteOfferedService,
} = require('../controllers/vendorController');

const router = express.Router();

router.get('/type/:type', getVendorsByType);

// Vendor Offered Services routes
router.get('/services/:vendorId', getOfferedServices);
router.post('/services', createOfferedService);
router.put('/services/:id', updateOfferedService);
router.delete('/services/:id', deleteOfferedService);

module.exports = router;
