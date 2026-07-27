require('dotenv').config();
const { sequelize, ProductCategory, Product, VendorRegistration, User } = require('./src/models');

async function seed() {
  try {
    // 1. Ensure a vendor user exists
    let vendorUser = await User.findOne({ where: { email: 'vendor@example.com' } });
    if (!vendorUser) {
      vendorUser = await User.create({
        firstName: 'Test',
        lastName: 'Vendor',
        email: 'vendor@example.com',
        mobile: '9999999999',
        password: 'hashed_password', // Mock
        role: 'vendor',
        city: 'Mumbai',
        isVerified: true
      });
    }

    // 2. Ensure VendorRegistration exists
    let supplier = await VendorRegistration.findOne({ where: { userId: vendorUser.id } });
    if (!supplier) {
      supplier = await VendorRegistration.create({
        userId: vendorUser.id,
        bizName: 'Fresh Farms Suppliers',
        vendorType: 'Raw Material Vendor',
        contactPerson: 'John Doe',
        email: vendorUser.email,
        mobile: vendorUser.mobile,
        city: 'Mumbai',
        status: 'approved'
      });
    }

    // 3. Create Categories
    const categories = [
      { name: 'Vegetables & Fruits', description: 'Fresh vegetables and fruits' },
      { name: 'Dairy Products', description: 'Milk, Cheese, Butter' },
      { name: 'Chicken, Meat & Seafood', description: 'Fresh non-veg items' }
    ];

    for (const cat of categories) {
      await ProductCategory.findOrCreate({
        where: { name: cat.name },
        defaults: cat
      });
    }

    const freshProduce = await ProductCategory.findOne({ where: { name: 'Vegetables & Fruits' } });
    const dairy = await ProductCategory.findOne({ where: { name: 'Dairy Products' } });

    // 4. Create Products
    const products = [
      {
        supplierId: supplier.id,
        categoryId: freshProduce.id,
        name: 'Tomatoes',
        description: 'Fresh local tomatoes',
        price: 45.00,
        unit: 'kg',
        stock: 500
      },
      {
        supplierId: supplier.id,
        categoryId: freshProduce.id,
        name: 'Onions',
        description: 'Red onions',
        price: 35.00,
        unit: 'kg',
        stock: 1000
      },
      {
        supplierId: supplier.id,
        categoryId: dairy.id,
        name: 'Full Cream Milk',
        description: 'Pasteurized milk',
        price: 65.00,
        unit: 'liter',
        stock: 200
      }
    ];

    for (const prod of products) {
      await Product.findOrCreate({
        where: { name: prod.name, supplierId: supplier.id },
        defaults: prod
      });
    }

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
