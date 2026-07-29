const { sequelize } = require('../config/db');
const User = require('./User');
const Document = require('./Document');
const HorecaRegistration = require('./HorecaRegistration');
const VendorRegistration = require('./VendorRegistration');
const UserLoginLog = require('./UserLoginLog');
const ProductCategory = require('./ProductCategory');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Requirement = require('./Requirement');
const ManpowerRequirement = require('./ManpowerRequirement');
const MarketingRequirement = require('./MarketingRequirement');
const ServiceProviderRequirement = require('./ServiceProviderRequirement');
const PasswordReset = require('./PasswordReset');

// Associations
User.hasMany(Document, { foreignKey: 'userId', as: 'documents', onDelete: 'CASCADE' });
Document.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasOne(HorecaRegistration, { foreignKey: 'userId', as: 'horecaRegistration', onDelete: 'CASCADE' });
HorecaRegistration.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasOne(VendorRegistration, { foreignKey: 'userId', as: 'vendorRegistration', onDelete: 'CASCADE' });
VendorRegistration.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(UserLoginLog, { foreignKey: 'userId', as: 'loginLogs', onDelete: 'CASCADE' });
UserLoginLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Raw Material Module Associations
ProductCategory.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
Product.belongsTo(ProductCategory, { foreignKey: 'categoryId', as: 'category' });

VendorRegistration.hasMany(Product, { foreignKey: 'supplierId', as: 'products' });
Product.belongsTo(VendorRegistration, { foreignKey: 'supplierId', as: 'supplier' });

HorecaRegistration.hasMany(Order, { foreignKey: 'ownerId', as: 'orders' });
Order.belongsTo(HorecaRegistration, { foreignKey: 'ownerId', as: 'owner' });

VendorRegistration.hasMany(Order, { foreignKey: 'supplierId', as: 'receivedOrders' });
Order.belongsTo(VendorRegistration, { foreignKey: 'supplierId', as: 'supplier' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// Manpower Requirement Associations
HorecaRegistration.hasMany(ManpowerRequirement, { foreignKey: 'ownerId', as: 'manpowerRequirements' });
ManpowerRequirement.belongsTo(HorecaRegistration, { foreignKey: 'ownerId', as: 'owner' });
VendorRegistration.hasMany(ManpowerRequirement, { foreignKey: 'supplierId', as: 'receivedManpowerRequirements' });
ManpowerRequirement.belongsTo(VendorRegistration, { foreignKey: 'supplierId', as: 'supplier' });

// Marketing Requirement Associations
HorecaRegistration.hasMany(MarketingRequirement, { foreignKey: 'ownerId', as: 'marketingRequirements' });
MarketingRequirement.belongsTo(HorecaRegistration, { foreignKey: 'ownerId', as: 'owner' });
VendorRegistration.hasMany(MarketingRequirement, { foreignKey: 'supplierId', as: 'receivedMarketingRequirements' });
MarketingRequirement.belongsTo(VendorRegistration, { foreignKey: 'supplierId', as: 'supplier' });

// Service Provider Requirement Associations
HorecaRegistration.hasMany(ServiceProviderRequirement, { foreignKey: 'ownerId', as: 'serviceProviderRequirements' });
ServiceProviderRequirement.belongsTo(HorecaRegistration, { foreignKey: 'ownerId', as: 'owner' });
VendorRegistration.hasMany(ServiceProviderRequirement, { foreignKey: 'supplierId', as: 'receivedServiceProviderRequirements' });
ServiceProviderRequirement.belongsTo(VendorRegistration, { foreignKey: 'supplierId', as: 'supplier' });

// Generic Requirement Associations
HorecaRegistration.hasMany(Requirement, { foreignKey: 'ownerId', as: 'requirements' });
Requirement.belongsTo(HorecaRegistration, { foreignKey: 'ownerId', as: 'owner' });
VendorRegistration.hasMany(Requirement, { foreignKey: 'supplierId', as: 'receivedRequirements' });
Requirement.belongsTo(VendorRegistration, { foreignKey: 'supplierId', as: 'supplier' });

module.exports = {
  sequelize,
  User,
  Document,
  HorecaRegistration,
  VendorRegistration,
  UserLoginLog,
  ProductCategory,
  Product,
  Order,
  OrderItem,
  Requirement,
  ManpowerRequirement,
  MarketingRequirement,
  ServiceProviderRequirement,
  PasswordReset,
};
