const { Sequelize } = require('sequelize');
const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const dbName = process.env.DB_NAME || 'HRCHUB';
const dbUser = process.env.DB_USER || 'postgres';
const dbPassword = process.env.DB_PASSWORD || 'your_password';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 5432;

// Function to auto-create database if it doesn't exist
const ensureDatabaseExists = async () => {
  const client = new Client({
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    database: 'postgres', // connect to default postgres db to create new db
  });

  try {
    await client.connect();
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
    if (res.rowCount === 0) {
      console.log(`Database "${dbName}" exist karat nahi. Creating database "${dbName}"...`);
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Database "${dbName}" successfully create jhala!`);
    }
  } catch (error) {
    console.error('Database create kartana error aala (Credentials/PostgreSQL Server check kara):', error.message);
  } finally {
    await client.end();
  }
};

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// Test and sync database connection
const connectDB = async () => {
  try {
    await ensureDatabaseExists();
    await sequelize.authenticate();
    console.log('PostgreSQL (Sequelize ORM) Connected Successfully!');
    // Sync models
    await sequelize.sync({ alter: true });
    console.log('Database Models Synchronized!');
  } catch (error) {
    console.error('PostgreSQL Connection Error via Sequelize:', error.message);
  }
};

module.exports = {
  sequelize,
  connectDB,
};
