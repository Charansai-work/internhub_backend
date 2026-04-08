require('dotenv').config(); // ✅ ONLY THIS (once, at top)

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const app = express();

// ✅ CORS — allow all localhost ports during development
const cors = require('cors')

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://internhub-frontend-amber.vercel.app'
  ],
  credentials: true
}))
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
