const express = require('express');
const cookieParser = require('cookie-parser')
const app = express();

// Middleware to parse JSON requests
app.use(express.json()); 
app.use(cookieParser())   

// Import routes
const authRoutes = require('./routes/auth.route');

// using all the routes
app.use('/api/auth', authRoutes);
// app.use('/api/auth',authRoutes)

module.exports = app;