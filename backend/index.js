const express = require('express');
const dotenv = require('dotenv');
const resumeRoutes = require('./routes/resume.route.js');
const mongoose = require('mongoose');
const dbConfig = require('./config/db.js');
const cors = require('cors');

dotenv.config();
dbConfig.connectDB();

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

app.use('/api/resume', resumeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
