const http = require('http');
const dotenv = require('dotenv');
const app = require('./app');
const { connectDB } = require('./config/db');
const socketService = require('./services/socketService');

dotenv.config();

// Load Models
require('./models');

// Connect to Database
connectDB();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize Socket.io
socketService.init(server);

server.listen(PORT, () => {
  console.log(`Server running with Socket.io in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
