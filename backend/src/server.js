require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic API connectivity APIs
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'HRC-HUB backend is running'
  });
});

app.get('/api/db-test', async (req, res) => {
  try {
    const connection = await db.getConnection();
    connection.release();
    res.json({
      success: true,
      message: 'Database connection successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
