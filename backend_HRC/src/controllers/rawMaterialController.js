const {
  getCategoriesService,
  getProductsService,
  createProductService,
  updateProductService,
  deleteProductService,
  updateStockService,
  getVendorAnalyticsService,
  getSuppliersService,
  createOrderService,
  getOwnerOrdersService,
  getVendorOrdersService,
  vendorRespondOrderService,
  getOrderByIdService,
  updateOrderStatusService,
  cancelOrderService
} = require('../services/rawMaterialService');

exports.getCategories = async (req, res) => {
  try {
    const categories = await getCategoriesService();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { categoryId, supplierId } = req.query;
    const products = await getProductsService({ categoryId, supplierId });
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await createProductService(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSuppliers = async (req, res) => {
  try {
    const suppliers = await getSuppliersService();
    res.status(200).json({ success: true, data: suppliers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { ownerId, supplierId, items, deliveryAddress, paymentMethod, notes } = req.body;
    
    if (!ownerId || !supplierId || !items || !items.length || !deliveryAddress) {
      return res.status(400).json({ success: false, message: 'Missing required order fields' });
    }

    const order = await createOrderService(ownerId, req.body);
    res.status(201).json({ success: true, message: 'Order created successfully', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOwnerOrders = async (req, res) => {
  try {
    const { ownerId } = req.params;
    
    // Basic UUID format check to prevent 500 DB errors
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!ownerId || !uuidRegex.test(ownerId)) {
      return res.status(400).json({ success: false, message: 'Invalid ownerId format. Must be a UUID.' });
    }

    const orders = await getOwnerOrdersService(ownerId);
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── New: Get all orders received by a vendor ──
exports.getVendorOrders = async (req, res) => {
  try {
    const { supplierId } = req.params;

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!supplierId || !uuidRegex.test(supplierId)) {
      return res.status(400).json({ success: false, message: 'Invalid supplierId format. Must be a UUID.' });
    }

    const orders = await getVendorOrdersService(supplierId);
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── New: Vendor responds to an order (accept/reject) ──
exports.vendorRespondOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { supplierId, action } = req.body;

    if (!supplierId || !action) {
      return res.status(400).json({ success: false, message: 'supplierId and action are required' });
    }
    if (!['confirmed', 'cancelled'].includes(action)) {
      return res.status(400).json({ success: false, message: "action must be 'confirmed' or 'cancelled'" });
    }

    const order = await vendorRespondOrderService(orderId, supplierId, action);
    res.status(200).json({ success: true, message: `Order ${action === 'confirmed' ? 'accepted' : 'rejected'} successfully`, data: order });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error.message.includes('Cannot respond') || error.message.includes('Invalid action')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── New: Get single order by ID ──
exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!orderId || !uuidRegex.test(orderId)) {
      return res.status(400).json({ success: false, message: 'Invalid orderId format. Must be a UUID.' });
    }

    const order = await getOrderByIdService(orderId);
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    if (error.message === 'Order not found') {
      return res.status(404).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── New: Update order status ──
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const order = await updateOrderStatusService(orderId, status);
    res.status(200).json({ success: true, message: `Order status updated to '${status}'`, data: order });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error.message.includes('Cannot transition') || error.message.includes('Invalid status')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── New: Cancel order ──
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    const order = await cancelOrderService(orderId, reason);
    res.status(200).json({ success: true, message: 'Order cancelled successfully', data: order });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error.message.includes('Cannot cancel')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── New: Update product ──
exports.updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await updateProductService(productId, req.body);
    res.status(200).json({ success: true, message: 'Product updated successfully', data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── New: Delete product ──
exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const result = await deleteProductService(productId);
    res.status(200).json({ success: true, message: 'Product deleted successfully', data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── New: Update stock ──
exports.updateStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const { stock } = req.body;
    const product = await updateStockService(productId, stock);
    res.status(200).json({ success: true, message: 'Stock updated successfully', data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── New: Get vendor analytics ──
exports.getVendorAnalytics = async (req, res) => {
  try {
    const { supplierId } = req.params;
    const analytics = await getVendorAnalyticsService(supplierId);
    res.status(200).json({ success: true, data: analytics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
