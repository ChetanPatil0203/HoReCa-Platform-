const { sequelize } = require('./src/config/db');

async function runMigration() {
  console.log('Starting Cloudinary database migration transaction...');
  const t = await sequelize.transaction();
  try {
    const queries = [
      // Documents table
      `ALTER TABLE "documents" ADD COLUMN IF NOT EXISTS "cloudinaryPublicId" VARCHAR(255)`,
      `ALTER TABLE "documents" ADD COLUMN IF NOT EXISTS "cloudinaryAssetId" VARCHAR(255)`,
      `ALTER TABLE "documents" ADD COLUMN IF NOT EXISTS "secureUrl" TEXT`,
      `ALTER TABLE "documents" ADD COLUMN IF NOT EXISTS "resourceType" VARCHAR(50)`,
      `ALTER TABLE "documents" ADD COLUMN IF NOT EXISTS "deliveryType" VARCHAR(50)`,
      `ALTER TABLE "documents" ADD COLUMN IF NOT EXISTS "format" VARCHAR(50)`,
      `ALTER TABLE "documents" ADD COLUMN IF NOT EXISTS "mimeType" VARCHAR(50)`,
      `ALTER TABLE "documents" ADD COLUMN IF NOT EXISTS "fileSize" INTEGER`,
      `ALTER TABLE "documents" ADD COLUMN IF NOT EXISTS "width" INTEGER`,
      `ALTER TABLE "documents" ADD COLUMN IF NOT EXISTS "height" INTEGER`,
      `ALTER TABLE "documents" ADD COLUMN IF NOT EXISTS "originalName" VARCHAR(255)`,

      // Products table
      `ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "cloudinaryPublicId" VARCHAR(255)`,
      `ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "cloudinaryAssetId" VARCHAR(255)`,
      `ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "secureUrl" TEXT`,
      `ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "resourceType" VARCHAR(50)`,
      `ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "deliveryType" VARCHAR(50)`,
      `ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "format" VARCHAR(50)`,
      `ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "mimeType" VARCHAR(50)`,
      `ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "fileSize" INTEGER`,
      `ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "width" INTEGER`,
      `ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "height" INTEGER`,
      `ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "originalName" VARCHAR(255)`,

      // Users table
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "profilePhotoPublicId" VARCHAR(255)`,
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "profilePhotoAssetId" VARCHAR(255)`,
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "profilePhotoResourceType" VARCHAR(50)`,
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "profilePhotoDeliveryType" VARCHAR(50)`,

      // Horeca Registrations table
      `ALTER TABLE "horeca_registrations" ADD COLUMN IF NOT EXISTS "profilePhotoPublicId" VARCHAR(255)`,
      `ALTER TABLE "horeca_registrations" ADD COLUMN IF NOT EXISTS "profilePhotoAssetId" VARCHAR(255)`,
      `ALTER TABLE "horeca_registrations" ADD COLUMN IF NOT EXISTS "profilePhotoResourceType" VARCHAR(50)`,
      `ALTER TABLE "horeca_registrations" ADD COLUMN IF NOT EXISTS "profilePhotoDeliveryType" VARCHAR(50)`,

      // Vendor Registrations table
      `ALTER TABLE "vendor_registrations" ADD COLUMN IF NOT EXISTS "profilePhotoPublicId" VARCHAR(255)`,
      `ALTER TABLE "vendor_registrations" ADD COLUMN IF NOT EXISTS "profilePhotoAssetId" VARCHAR(255)`,
      `ALTER TABLE "vendor_registrations" ADD COLUMN IF NOT EXISTS "profilePhotoResourceType" VARCHAR(50)`,
      `ALTER TABLE "vendor_registrations" ADD COLUMN IF NOT EXISTS "profilePhotoDeliveryType" VARCHAR(50)`,
    ];

    for (const query of queries) {
      console.log(`Executing: ${query}`);
      await sequelize.query(query, { transaction: t });
    }

    await t.commit();
    console.log('Database migrated successfully! Transaction committed.');
    process.exit(0);
  } catch (error) {
    await t.rollback();
    console.error('Migration failed. Transaction rolled back successfully.', error);
    process.exit(1);
  }
}

runMigration();
