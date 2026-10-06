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
const authRouter = require('./routes/auth.route');
const interviewRouter = require('./routes/interview.route')

// using all the routes
app.use('/api/auth', authRouter);
app.use('/api/interview',interviewRouter)

module.exports = app;
