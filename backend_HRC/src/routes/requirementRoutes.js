const express = require('express');
const router = express.Router();
const requirementController = require('../controllers/requirementController');

// POST create requirement (direct or public)
router.post('/', requirementController.createRequirement);

// GET all requirements posted by an owner
router.get('/owner/:ownerId', requirementController.getOwnerRequirements);

// GET unified activity history for an owner (orders + requirements)
router.get('/history/owner/:ownerId', requirementController.getOwnerHistory);

// GET live tracking records for an owner across all 4 pillars
router.get('/tracking/owner/:ownerId', requirementController.getOwnerTracking);

// GET direct requirements received by a vendor
router.get('/vendor/:supplierId', requirementController.getVendorRequirements);

// GET public requirements (Feed Wall posts)
router.get('/public', requirementController.getPublicRequirements);

// GET vendor clients summary and deployments
router.get('/clients/vendor/:supplierId', requirementController.getVendorClients);

// PATCH update status of a requirement
router.patch('/:requirementId/status', requirementController.updateRequirementStatus);

module.exports = router;
