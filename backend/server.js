const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to the Database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

//Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
// Base Test Route
app.get('/', (req, res) => {
  res.send('CodeArena API is running smoothly...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});