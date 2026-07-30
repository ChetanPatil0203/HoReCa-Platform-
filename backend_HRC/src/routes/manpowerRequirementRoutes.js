const express = require('express');
const router = express.Router();
const manpowerController = require('../controllers/manpowerRequirementController');

// POST create manpower requirement
router.post('/', manpowerController.createRequirement);

// GET manpower dashboard summary for an owner
router.get('/dashboard-summary/:ownerId', manpowerController.getDashboardSummary);

// GET manpower requirements posted by an owner
router.get('/owner/:ownerId', manpowerController.getOwnerRequirements);

// GET direct manpower requirements received by a vendor
router.get('/vendor/:supplierId', manpowerController.getVendorRequirements);

// GET public manpower requirements (Feed Wall)
router.get('/public', manpowerController.getPublicRequirements);

// PATCH update status of manpower requirement
router.patch('/:requirementId/status', manpowerController.updateRequirementStatus);

module.exports = router;
