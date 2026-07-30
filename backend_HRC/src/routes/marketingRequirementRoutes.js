const express = require('express');
const router = express.Router();
const marketingController = require('../controllers/marketingRequirementController');

// POST create marketing requirement
router.post('/', marketingController.createRequirement);

// GET marketing dashboard summary for an owner
router.get('/dashboard-summary/:ownerId', marketingController.getDashboardSummary);

// GET marketing requirements posted by an owner
router.get('/owner/:ownerId', marketingController.getOwnerRequirements);

// GET direct marketing requirements received by a vendor
router.get('/vendor/:supplierId', marketingController.getVendorRequirements);

// GET public marketing requirements (Feed Wall)
router.get('/public', marketingController.getPublicRequirements);

// PATCH update status of marketing requirement
router.patch('/:requirementId/status', marketingController.updateRequirementStatus);

module.exports = router;
