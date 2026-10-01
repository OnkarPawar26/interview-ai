require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');
const invokeGeminiAI = require('./src/services/ai.service')


// Connect to MongoDB
connectDB();
invokeGeminiAI();

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
