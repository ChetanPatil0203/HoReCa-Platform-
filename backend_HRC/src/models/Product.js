const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  supplierId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'vendor_registrations',
      key: 'id',
    },
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'product_categories',
      key: 'id',
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  unit: {
    type: DataTypes.STRING, // e.g., 'kg', 'liter', 'box', 'piece'
    allowNull: false,
    defaultValue: 'unit',
  },
  moq: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  expiry: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cloudinaryPublicId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cloudinaryAssetId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  secureUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  resourceType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  deliveryType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  format: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  mimeType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  width: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  height: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  originalName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: 'products',
});

module.exports = Product;
