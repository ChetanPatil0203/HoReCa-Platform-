const { sequelize } = require('../config/db');
const User = require('./User');
const Document = require('./Document');
const HorecaRegistration = require('./HorecaRegistration');
const VendorRegistration = require('./VendorRegistration');
const UserLoginLog = require('./UserLoginLog');

// Associations
User.hasMany(Document, { foreignKey: 'userId', as: 'documents', onDelete: 'CASCADE' });
Document.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasOne(HorecaRegistration, { foreignKey: 'userId', as: 'horecaRegistration', onDelete: 'CASCADE' });
HorecaRegistration.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasOne(VendorRegistration, { foreignKey: 'userId', as: 'vendorRegistration', onDelete: 'CASCADE' });
VendorRegistration.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(UserLoginLog, { foreignKey: 'userId', as: 'loginLogs', onDelete: 'CASCADE' });
UserLoginLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  User,
  Document,
  HorecaRegistration,
  VendorRegistration,
  UserLoginLog,
};
