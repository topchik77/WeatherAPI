const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const connectDB = require('./config/db');
connectDB().catch(console.dir);

const userRoutes = require('./routes/userRoutes');
const userCrudRoutes = require('./routes/userCrudRoutes');


const forecastRoutes = require('./routes/forecastRoutes');



const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT;
app.use(cors({
  origin: `http://localhost:${PORT}`,
  credentials: true,
}));

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/userCrud', userCrudRoutes);
app.use('/api/forecast', forecastRoutes);




// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
