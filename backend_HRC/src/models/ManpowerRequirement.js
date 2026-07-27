const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ManpowerRequirement = sequelize.define('ManpowerRequirement', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  ownerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'horeca_registrations',
      key: 'id',
    },
  },
  supplierId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'vendor_registrations',
      key: 'id',
    },
  },
  requestType: {
    type: DataTypes.ENUM('direct', 'public'),
    allowNull: false,
    defaultValue: 'public',
  },
  jobRole: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  numberOfStaff: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  experience: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  salaryRange: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  employmentType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  shift: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  joiningDate: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  accommodation: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  food: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  weeklyOff: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  workingHours: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  urgentRequirement: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending',
  },
}, {
  timestamps: true,
  tableName: 'manpower_requirements',
});

module.exports = ManpowerRequirement;
