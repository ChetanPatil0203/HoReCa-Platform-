const {
  getUserComplianceDocuments,
  saveUserComplianceDocument,
  deleteUserComplianceDocument,
} = require('../services/documentService');

exports.getUserDocuments = async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await getUserComplianceDocuments(userId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.saveDocument = async (req, res) => {
  try {
    const doc = await saveUserComplianceDocument(req.body);
    res.status(201).json({ success: true, message: 'Document saved successfully', data: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteUserComplianceDocument(id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
