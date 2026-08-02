const express = require('express');
const router = express.Router();
const serviceProviderController = require('../controllers/serviceProviderRequirementController');

// POST create service provider requirement
router.post('/', serviceProviderController.createRequirement);

// GET service provider requirements posted by an owner
router.get('/owner/:ownerId', serviceProviderController.getOwnerRequirements);

// GET direct service provider requirements received by a vendor
router.get('/vendor/:supplierId', serviceProviderController.getVendorRequirements);

// GET public service provider requirements (Feed Wall)
router.get('/public', serviceProviderController.getPublicRequirements);

// PATCH update status of service provider requirement
router.patch('/:requirementId/status', serviceProviderController.updateRequirementStatus);

// POST submit quote for service provider requirement
router.post('/:requirementId/quote', serviceProviderController.submitQuote);

// POST decline service provider requirement
router.post('/:requirementId/decline', serviceProviderController.declineRequirement);

module.exports = router;
