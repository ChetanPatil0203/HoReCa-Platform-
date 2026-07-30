const candidateService = require('../services/candidateService');

exports.createCandidate = async (req, res) => {
  try {
    const candidate = await candidateService.createCandidateService(req.body);
    return res.status(201).json({
      success: true,
      message: 'Candidate added successfully',
      data: candidate,
    });
  } catch (error) {
    console.error('Error creating candidate:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create candidate',
    });
  }
};

exports.getVendorCandidates = async (req, res) => {
  try {
    const { supplierId } = req.params;
    const candidates = await candidateService.getVendorCandidatesService(supplierId);
    return res.status(200).json({
      success: true,
      data: candidates,
    });
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch candidates',
    });
  }
};

exports.updateCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const { supplierId } = req.body;
    const candidate = await candidateService.updateCandidateService(id, supplierId, req.body);
    return res.status(200).json({
      success: true,
      message: 'Candidate updated successfully',
      data: candidate,
    });
  } catch (error) {
    console.error('Error updating candidate:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update candidate',
    });
  }
};

exports.deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const supplierId = req.query.supplierId || req.body.supplierId;
    const result = await candidateService.deleteCandidateService(id, supplierId);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error deleting candidate:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete candidate',
    });
  }
};
