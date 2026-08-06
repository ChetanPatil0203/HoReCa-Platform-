const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');

// GET user compliance documents (Protected: JWT + ownership check)
router.get('/user/:userId', authMiddleware, documentController.getUserDocuments);

// POST save/update compliance document
router.post('/', documentController.saveDocument);

// POST upload compliance file to Cloudinary (Protected)
router.post('/upload-compliance', authMiddleware, upload.single('file'), documentController.uploadComplianceFile);

// DELETE compliance document (Protected: JWT + ownership check)
router.delete('/:id', authMiddleware, documentController.deleteDocument);

module.exports = router;
