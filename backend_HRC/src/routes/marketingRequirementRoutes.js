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

// Proposals Endpoints
router.post('/proposals', marketingController.createProposal);
router.get('/proposals/:requirementId', marketingController.getRequirementProposals);
router.patch('/proposals/:proposalId/accept', marketingController.acceptProposal);

// Creatives Endpoints
router.post('/creatives', marketingController.createCreative);
router.get('/creatives/:requirementId', marketingController.getRequirementCreatives);
router.patch('/creatives/:creativeId/status', marketingController.updateCreativeStatus);

// Team Roster Endpoints
router.post('/team', marketingController.createTeamMember);
router.get('/team/:supplierId', marketingController.getVendorTeamMembers);
router.put('/team/:id', marketingController.updateTeamMember);
router.delete('/team/:id', marketingController.deleteTeamMember);

// Revenue Analytics Endpoint
router.get('/revenue/:supplierId', marketingController.getVendorRevenueAnalytics);

module.exports = router;
