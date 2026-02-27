require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const path = require('path');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const pocRoutes = require('./routes/pocRoutes');

const app = express();

/* Security middleware */
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(cookieParser());

/* Rate limiting for auth endpoints */
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { message: 'Too many requests, please try again later' },
});

/* Body parsing */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

/* NoSQL injection sanitization (Express 5 safe) */
app.use((req, _res, next) => {
    if (req.body) mongoSanitize.sanitize(req.body, {});
    if (req.params) mongoSanitize.sanitize(req.params, {});
    next();
});

/* Static uploads */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* Routes */
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pocs', pocRoutes);

/* Health check */
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/* Error handler (must be last) */
app.use(errorHandler);

/* Start server */
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();

module.exports = app;


