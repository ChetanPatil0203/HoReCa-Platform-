const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const MarketingCampaignMetric = sequelize.define('MarketingCampaignMetric', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  requirementId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  supplierId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  reach: {
    type: DataTypes.STRING,
    defaultValue: '0',
  },
  impressions: {
    type: DataTypes.STRING,
    defaultValue: '0',
  },
  leads: {
    type: DataTypes.STRING,
    defaultValue: '0',
  },
  engagement: {
    type: DataTypes.STRING,
    defaultValue: '0',
  },
  adSpend: {
    type: DataTypes.STRING,
    defaultValue: '0',
  },
  proofFiles: {
    type: DataTypes.TEXT, // JSON array of proof URLs
    allowNull: true,
  },
  metricsDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: 'marketing_campaign_metrics',
});

module.exports = MarketingCampaignMetric;
