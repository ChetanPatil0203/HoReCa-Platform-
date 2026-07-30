const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');

// GET user compliance documents
router.get('/user/:userId', documentController.getUserDocuments);

// POST save/update compliance document
router.post('/', documentController.saveDocument);

// DELETE compliance document
router.delete('/:id', documentController.deleteDocument);

module.exports = router;
