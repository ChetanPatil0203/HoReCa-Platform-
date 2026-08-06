require('dotenv').config();
const { sequelize } = require('./src/models');

async function fixAndSync() {
  try {
    console.log('Cleaning up orphaned records to satisfy foreign key constraints...');
    
    // Delete horeca_registrations where userId is not in users table
    await sequelize.query(`
      DELETE FROM "horeca_registrations" 
      WHERE "userId" NOT IN (SELECT "id" FROM "users")
    `);
    
    // Delete vendor_registrations where userId is not in users table
    await sequelize.query(`
      DELETE FROM "vendor_registrations" 
      WHERE "userId" NOT IN (SELECT "id" FROM "users")
    `);

    // Delete products where supplierId is not in vendor_registrations
    await sequelize.query(`
      DELETE FROM "products"
      WHERE "supplierId" NOT IN (SELECT "id" FROM "vendor_registrations")
    `);

    // Delete requirements where ownerId is not in horeca_registrations
    await sequelize.query(`
      DELETE FROM "requirements"
      WHERE "ownerId" NOT IN (SELECT "id" FROM "horeca_registrations")
    `);

    console.log('Orphaned records cleaned. Synchronizing database with alter: true...');
    await sequelize.sync({ alter: true });
    
    console.log('Database synchronized successfully! All tables are now up to date.');
    process.exit(0);
  } catch (error) {
    console.error('Error synchronizing database:', error);
    process.exit(1);
  }
}

fixAndSync();
