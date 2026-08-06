const {
  ProductCategory,
  Product,
  Order,
  OrderItem,
  VendorRegistration,
  HorecaRegistration,
  sequelize
} = require('../models');
const { Op } = require('sequelize');

exports.getCategoriesService = async () => {
  return await ProductCategory.findAll({
    order: [['name', 'ASC']]
  });
};

exports.getProductsService = async (filters) => {
  const where = {};
  if (filters.categoryId) where.categoryId = filters.categoryId;
  if (filters.supplierId) where.supplierId = filters.supplierId;

  return await Product.findAll({
    where,
    include: [
      { model: ProductCategory, as: 'category', attributes: ['id', 'name'] },
      { model: VendorRegistration, as: 'supplier', attributes: ['id', 'bizName'] }
    ]
  });
};

exports.getSuppliersService = async () => {
  const suppliers = await VendorRegistration.findAll({
    where: { 
      vendorType: {
        [Op.in]: ['Raw Material Vendor', 'Raw Material']
      }
    },
    attributes: ['id', 'bizName', 'city', 'subCategory'],
    include: [
      { 
        model: Product, 
        as: 'products',
        attributes: ['categoryId'],
        include: [
          {
            model: ProductCategory,
            as: 'category',
            attributes: ['name']
          }
        ]
      }
    ]
  });

  // Map to include a unique list of category names for each supplier
  return suppliers.map(s => {
    const sJson = s.toJSON();
    let categories = [...new Set(sJson.products.map(p => p.category?.name).filter(Boolean))];
    
    // Fallback: If no products, try to guess category from subCategory
    if (sJson.subCategory) {
      const sub = sJson.subCategory.toLowerCase();
      if (sub.includes('spice') || sub.includes('oil')) categories.push('Oil & Spices');
      if (sub.includes('grocery') || sub.includes('grain') || sub.includes('rice') || sub.includes('flour')) categories.push('Rice, Flour & Grains');
      if (sub.includes('veg') || sub.includes('fruit')) categories.push('Vegetables & Fruits');
      if (sub.includes('dairy') || sub.includes('milk')) categories.push('Dairy Products');
      if (sub.includes('meat') || sub.includes('chicken') || sub.includes('seafood')) categories.push('Chicken, Meat & Seafood');
      if (sub.includes('beverage') || sub.includes('drink')) categories.push('Beverages');
      if (sub.includes('clean') || sub.includes('wash')) categories.push('Cleaning Material');
      if (sub.includes('pack') || sub.includes('box')) categories.push('Packaging Material');
      categories.push(sJson.subCategory);
    }

    // Ensure uniqueness
    categories = [...new Set(categories)];

    return { ...sJson, categories };
  });
};

exports.createProductService = async (productData) => {
  const {
    supplierId, name, category, stock, unit, price, sku, moq, expiry,
    imageUrl,
    cloudinaryPublicId, cloudinaryAssetId, secureUrl, resourceType, deliveryType,
    format, mimeType, fileSize, width, height, originalName
  } = productData;

  const transaction = await sequelize.transaction();

  try {
    // Check if supplier exists
    const supplier = await VendorRegistration.findByPk(supplierId, { transaction });
    if (!supplier) throw new Error(`Supplier not found for ID: ${supplierId}`);

    // Resolve or create category
    let productCategory;
    if (category) {
      [productCategory] = await ProductCategory.findOrCreate({
        where: { name: category },
        defaults: { name: category, description: category },
        transaction
      });
    }

    const newProduct = await Product.create({
      supplierId,
      categoryId: productCategory ? productCategory.id : null,
      name,
      price: price || 0,
      unit: unit || 'kg',
      stock: stock || 0,
      sku: sku || null,
      moq: moq || 1,
      expiry: expiry || null,
      imageUrl: imageUrl || null,
      cloudinaryPublicId: cloudinaryPublicId || null,
      cloudinaryAssetId: cloudinaryAssetId || null,
      secureUrl: secureUrl || null,
      resourceType: resourceType || null,
      deliveryType: deliveryType || null,
      format: format || null,
      mimeType: mimeType || null,
      fileSize: fileSize || null,
      width: width || null,
      height: height || null,
      originalName: originalName || null,
    }, { transaction });

    await transaction.commit();

    return await Product.findByPk(newProduct.id, {
      include: [
        { model: ProductCategory, as: 'category', attributes: ['id', 'name'] },
        { model: VendorRegistration, as: 'supplier', attributes: ['id', 'bizName'] }
      ]
    });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

exports.createOrderService = async (ownerId, orderData) => {
  const { supplierId, items, deliveryAddress, paymentMethod, notes } = orderData;
  const transaction = await sequelize.transaction();

  try {
    let totalAmount = 0;
    
    // Create the order first
    const order = await Order.create({
      ownerId,
      supplierId,
      totalAmount: 0, // Will update shortly
      deliveryAddress,
      paymentMethod: paymentMethod || 'cod',
      notes: notes || null,
      status: 'pending'
    }, { transaction });

    // Validate and create items
    for (const item of items) {
      const product = await Product.findByPk(item.productId, { transaction });
      if (!product) throw new Error(`Product ${item.productId} not found`);
      
      const itemPrice = parseFloat(product.price);
      totalAmount += itemPrice * item.quantity;

      await OrderItem.create({
        orderId: order.id,
        productId: product.id,
        quantity: item.quantity,
        priceAtPurchase: itemPrice
      }, { transaction });
    }

    // Update total amount
    order.totalAmount = totalAmount;
    await order.save({ transaction });

    await transaction.commit();

    // Return the full order with items
    return await Order.findByPk(order.id, {
      include: [
        { model: VendorRegistration, as: 'supplier', attributes: ['id', 'bizName', 'city', 'mobile'] },
        { 
          model: OrderItem, 
          as: 'items',
          include: [{ model: Product, as: 'product', attributes: ['name', 'unit', 'imageUrl', 'price'] }]
        }
      ]
    });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

exports.getOwnerOrdersService = async (ownerId) => {
  return await Order.findAll({
    where: { ownerId },
    include: [
      { model: VendorRegistration, as: 'supplier', attributes: ['id', 'bizName', 'city'] },
      { 
        model: OrderItem, 
        as: 'items',
        include: [{ model: Product, as: 'product', attributes: ['name', 'unit', 'imageUrl', 'price'] }]
      }
    ],
    order: [['createdAt', 'DESC']]
  });
};

// ── New: Get all orders received by a vendor (supplierId) ──
exports.getVendorOrdersService = async (supplierId) => {
  return await Order.findAll({
    where: { supplierId },
    include: [
      { model: HorecaRegistration, as: 'owner', attributes: ['id', 'bizName', 'city', 'address', 'mobile', 'email', 'ownerName'] },
      { 
        model: OrderItem, 
        as: 'items',
        include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'unit', 'imageUrl', 'price'] }]
      }
    ],
    order: [['createdAt', 'DESC']]
  });
};

// ── New: Vendor accepts or rejects an order ──
exports.vendorRespondOrderService = async (orderId, supplierId, action) => {
  const validActions = ['confirmed', 'cancelled'];
  if (!validActions.includes(action)) {
    throw new Error(`Invalid action: '${action}'. Must be 'confirmed' or 'cancelled'.`);
  }

  const order = await Order.findOne({ where: { id: orderId, supplierId } });
  if (!order) throw new Error('Order not found or does not belong to this vendor');

  if (order.status !== 'pending') {
    throw new Error(`Cannot respond to order with status '${order.status}'. Only pending orders can be accepted or rejected.`);
  }

  order.status = action;
  if (action === 'cancelled') {
    order.cancelledAt = new Date();
    order.cancelReason = 'Rejected by vendor';
  }
  await order.save();

  return await Order.findByPk(order.id, {
    include: [
      { model: HorecaRegistration, as: 'owner', attributes: ['id', 'bizName', 'city', 'address', 'mobile'] },
      { model: VendorRegistration, as: 'supplier', attributes: ['id', 'bizName'] },
      {
        model: OrderItem,
        as: 'items',
        include: [{ model: Product, as: 'product', attributes: ['name', 'unit', 'price'] }]
      }
    ]
  });
};

// ── New: Get single order by ID ──
exports.getOrderByIdService = async (orderId) => {
  console.log(`[ORDER SERVICE LOG] Searching DB for Order ID: ${orderId}...`);
  const order = await Order.findByPk(orderId, {
    include: [
      { model: VendorRegistration, as: 'supplier', attributes: ['id', 'bizName', 'city', 'mobile', 'email', 'address'] },
      { model: HorecaRegistration, as: 'owner', attributes: ['id', 'bizName', 'city', 'address', 'mobile', 'email'] },
      { 
        model: OrderItem, 
        as: 'items',
        include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'unit', 'imageUrl', 'price', 'moq'] }]
      }
    ]
  });
  if (!order) throw new Error('Order not found');

  console.log(`[ORDER SERVICE LOG] DB Match Found -> Order #${order.id.slice(0, 8)} | Current Status: ${order.status} | Supplier: ${order.supplier?.bizName || 'N/A'} | Owner: ${order.owner?.bizName || 'N/A'} | Items Count: ${order.items?.length || 0}`);
  return order;
};

// ── New: Update order status ──
exports.updateOrderStatusService = async (orderId, newStatus) => {
  console.log(`[ORDER SERVICE LOG] Validating status transition to '${newStatus}' for Order: ${orderId}`);
  const validStatuses = ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(newStatus)) {
    throw new Error(`Invalid status: ${newStatus}. Must be one of: ${validStatuses.join(', ')}`);
  }

  const order = await Order.findByPk(orderId);
  if (!order) throw new Error('Order not found');

  // Basic transition validation
  const transitions = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['processing', 'cancelled'],
    processing: ['packed', 'cancelled'],
    packed: ['shipped', 'cancelled'],
    shipped: ['delivered'],
    delivered: [],
    cancelled: []
  };

  if (!transitions[order.status]?.includes(newStatus)) {
    throw new Error(`Cannot transition from '${order.status}' to '${newStatus}'`);
  }

  console.log(`[ORDER SERVICE LOG] ⚙️ Status Changing: ${order.status} ===> ${newStatus}`);
  order.status = newStatus;
  if (newStatus === 'cancelled') {
    order.cancelledAt = new Date();
  }
  await order.save();
  console.log(`[ORDER SERVICE LOG] 💾 Status successfully saved to Database!`);
  return order;
};

// ── New: Cancel order ──
exports.cancelOrderService = async (orderId, reason) => {
  const order = await Order.findByPk(orderId);
  if (!order) throw new Error('Order not found');

  if (!['pending', 'confirmed'].includes(order.status)) {
    throw new Error(`Cannot cancel order with status '${order.status}'. Only pending or confirmed orders can be cancelled.`);
  }

  order.status = 'cancelled';
  order.cancelledAt = new Date();
  order.cancelReason = reason || 'Cancelled by owner';
  await order.save();

  return order;
};

// ── New: Update existing product ──
exports.updateProductService = async (productId, updateData) => {
  const product = await Product.findByPk(productId);
  if (!product) throw new Error('Product not found');

  if (updateData.category) {
    const [productCategory] = await ProductCategory.findOrCreate({
      where: { name: updateData.category },
      defaults: { name: updateData.category, description: updateData.category }
    });
    product.categoryId = productCategory.id;
  }

  if (updateData.name !== undefined) product.name = updateData.name;
  if (updateData.price !== undefined) product.price = updateData.price;
  if (updateData.unit !== undefined) product.unit = updateData.unit;
  if (updateData.stock !== undefined) product.stock = updateData.stock;
  if (updateData.description !== undefined) product.description = updateData.description;
  if (updateData.sku !== undefined) product.sku = updateData.sku;
  if (updateData.moq !== undefined) product.moq = updateData.moq;
  if (updateData.expiry !== undefined) product.expiry = updateData.expiry;

  await product.save();

  return await Product.findByPk(product.id, {
    include: [
      { model: ProductCategory, as: 'category', attributes: ['id', 'name'] },
      { model: VendorRegistration, as: 'supplier', attributes: ['id', 'bizName'] }
    ]
  });
};

// ── New: Delete product ──
exports.deleteProductService = async (productId) => {
  const product = await Product.findByPk(productId);
  if (!product) throw new Error('Product not found');
  await product.destroy();
  return { success: true, message: 'Product deleted successfully' };
};

// ── New: Quick stock update ──
exports.updateStockService = async (productId, newStock) => {
  const product = await Product.findByPk(productId);
  if (!product) throw new Error('Product not found');
  product.stock = Math.max(0, parseInt(newStock, 10) || 0);
  await product.save();
  return product;
};

// ── New: Vendor Analytics Service ──
exports.getVendorAnalyticsService = async (supplierId) => {
  const orders = await Order.findAll({
    where: { supplierId },
    include: [
      { model: HorecaRegistration, as: 'owner', attributes: ['id', 'bizName', 'city', 'ownerName', 'mobile'] },
      {
        model: OrderItem,
        as: 'items',
        include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'unit', 'price'] }]
      }
    ]
  });

  const products = await Product.findAll({ where: { supplierId } });

  let totalRevenue = 0;
  let pendingOrdersCount = 0;
  let confirmedOrdersCount = 0;
  let deliveredOrdersCount = 0;
  let cancelledOrdersCount = 0;

  const clientMap = {};

  orders.forEach(order => {
    const amount = parseFloat(order.totalAmount || 0);
    if (['confirmed', 'processing', 'packed', 'shipped', 'delivered'].includes(order.status)) {
      totalRevenue += amount;
    }

    if (order.status === 'pending') pendingOrdersCount++;
    else if (['confirmed', 'processing', 'packed', 'shipped'].includes(order.status)) confirmedOrdersCount++;
    else if (order.status === 'delivered') deliveredOrdersCount++;
    else if (order.status === 'cancelled') cancelledOrdersCount++;

    if (order.owner) {
      const ownerId = order.owner.id;
      if (!clientMap[ownerId]) {
        clientMap[ownerId] = {
          id: ownerId,
          bizName: order.owner.bizName || 'Restaurant Client',
          ownerName: order.owner.ownerName || 'Owner',
          city: order.owner.city || 'Local City',
          mobile: order.owner.mobile || '',
          totalOrders: 0,
          totalSpent: 0,
          lastOrderDate: order.createdAt
        };
      }
      clientMap[ownerId].totalOrders += 1;
      clientMap[ownerId].totalSpent += amount;
      if (new Date(order.createdAt) > new Date(clientMap[ownerId].lastOrderDate)) {
        clientMap[ownerId].lastOrderDate = order.createdAt;
      }
    }
  });

  const clients = Object.values(clientMap);

  return {
    totalRevenue,
    totalOrders: orders.length,
    pendingOrdersCount,
    confirmedOrdersCount,
    deliveredOrdersCount,
    cancelledOrdersCount,
    totalProducts: products.length,
    inStockProducts: products.filter(p => p.stock > 0).length,
    outOfStockProducts: products.filter(p => p.stock <= 0).length,
    activeClientsCount: clients.length,
    clients
  };
};
