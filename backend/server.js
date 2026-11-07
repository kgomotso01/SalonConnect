const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173'
}));

app.use(express.json());

// Authentication routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Services routes
const serviceRoutes = require('./routes/services');
app.use('/api/services', serviceRoutes);

const appointmentRoutes = require('./routes/appointments')
app.use('/api/appointments', appointmentRoutes)

// MySQL connection
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Home route
app.get('/', (req, res) => {
    res.send('SalonConnect Backend is running!');
});

// Test database connection
app.get('/api/db-test', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT DATABASE() AS database_name'
        );

        res.json({
            message: 'Database connected successfully!',
            database: rows[0].database_name
        });

    } catch (error) {
        console.error('Database error:', error.message);

        res.status(500).json({
            message: 'Database connection failed.'
        });
    }
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`SalonConnect server running on port ${PORT}`);
});