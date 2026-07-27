require('dotenv').config();
const { ProductCategory, Product, OrderItem, Order } = require('./src/models');

async function clean() {
  try {
    console.log('Cleaning old raw material data...');
    await OrderItem.destroy({ where: {} });
    await Order.destroy({ where: {} });
    await Product.destroy({ where: {} });
    await ProductCategory.destroy({ where: {} });
    console.log('Cleaned successfully. Running seed...');
    
    // Call seed
    require('./seedRawMaterials.js');
  } catch (err) {
    console.error('Clean error:', err);
    process.exit(1);
  }
}

clean();
