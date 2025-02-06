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


const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:' + PORT,
  credentials: true,
}));


app.use('/api/users', userRoutes);
app.use('/api/userCrud', userCrudRoutes);
app.use('/api/forecast', forecastRoutes);

app.use(express.static(path.join(__dirname, 'front')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'front', 'home.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:`,PORT);
});
