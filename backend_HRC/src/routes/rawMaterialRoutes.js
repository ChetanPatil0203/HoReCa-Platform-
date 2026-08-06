const express = require('express');
const router = express.Router();
const rawMaterialController = require('../controllers/rawMaterialController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');

// GET all categories
router.get('/categories', rawMaterialController.getCategories);

// GET all products (can filter by categoryId or supplierId via query params)
router.get('/products', rawMaterialController.getProducts);

// POST create a new product
router.post('/products', rawMaterialController.createProduct);

// GET all suppliers (Raw Material Vendors)
router.get('/suppliers', rawMaterialController.getSuppliers);

// POST place a new order
router.post('/orders', rawMaterialController.createOrder);

// GET order history for a specific owner
router.get('/orders/owner/:ownerId', rawMaterialController.getOwnerOrders);

// GET all orders received by a specific vendor/supplier
router.get('/orders/vendor/:supplierId', rawMaterialController.getVendorOrders);

// GET single order by ID
router.get('/orders/:orderId', rawMaterialController.getOrderById);

// PATCH update order status
router.patch('/orders/:orderId/status', rawMaterialController.updateOrderStatus);

// PATCH vendor responds to an order (accept or reject)
router.patch('/orders/:orderId/vendor-respond', rawMaterialController.vendorRespondOrder);

// PUT update product details
router.put('/products/:productId', rawMaterialController.updateProduct);

// DELETE product
router.delete('/products/:productId', rawMaterialController.deleteProduct);

// PATCH quick stock update
router.patch('/products/:productId/stock', rawMaterialController.updateStock);

// GET vendor analytics summary
router.get('/analytics/vendor/:supplierId', rawMaterialController.getVendorAnalytics);

// POST upload product image to Cloudinary (Protected)
router.post('/products/upload-image', authMiddleware, upload.single('file'), rawMaterialController.uploadProductImage);

module.exports = router;
