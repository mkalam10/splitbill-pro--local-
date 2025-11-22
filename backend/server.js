const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS with options for Vercel deployment
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like Postman, mobile apps, or file-based local testing)
    if (!origin) return callback(null, true);

    // Regular expression to match localhost with any port
    const localhostRegex = /^http:\/\/localhost(:\d+)?$/;

    // Allow all Vercel domains and localhost for development
    const allowed = origin.endsWith('.vercel.app') || localhostRegex.test(origin);
    
    if (allowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));


// Mount routers
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/bills', require('./routes/bills.routes'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
