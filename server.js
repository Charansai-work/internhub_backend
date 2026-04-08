require('dotenv').config(); // ✅ load env

const express = require('express');
const cors = require('cors'); // ✅ ONLY ONCE
const morgan = require('morgan');

const connectDB = require('./config/db');

// Connect DB
connectDB();

const app = express();

// ✅ SIMPLE CORS (WORKS EVERYWHERE)
app.use(cors());

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/internships', require('./routes/internship.routes'));
app.use('/api/applications', require('./routes/application.routes'));
app.use('/api/tasks', require('./routes/task.routes'));
app.use('/api/submissions', require('./routes/submission.routes'));
app.use('/api/feedback', require('./routes/feedback.routes'));
app.use('/api/dashboard', require('./routes/dashboard.routes'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Internship Platform API is running' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
