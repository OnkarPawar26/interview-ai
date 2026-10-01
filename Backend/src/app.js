const express = require('express');
const cookieParser = require('cookie-parser')
const app = express();
const cors = require('cors')


// Middleware to parse JSON requests
app.use(express.json()); 
app.use(cookieParser()) 
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true, // Allow credentials (cookies) to be sent
}))

// Import routes
const authRoutes = require('./routes/auth.route');

// using all the routes
app.use('/api/auth', authRoutes);
// app.use('/api/auth',authRoutes)

module.exports = app;
