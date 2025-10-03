const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
require('./config/db')(); // Connect to MongoDB

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/assets', require('./routes/assetRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

// Error handling fallback
app.use((req, res) => {
  res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Endpoint not found' } });
});

module.exports = app;