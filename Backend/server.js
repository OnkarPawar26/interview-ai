require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');
const invokeGeminiAI = require('./src/services/ai.service')
const {resume, selfDescription, jobDescription} = require('./src/services/temp.js')
const generateInterviewReport = require('./src/services/ai.service')

generateInterviewReport({ resume, selfDescription, jobDescription })


// Connect to MongoDB
connectDB();


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
