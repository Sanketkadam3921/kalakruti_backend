const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const corsMiddleware = require('./config/corsConfig');
const apiLimiter = require('./config/rateLimitConfig');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
const projectRoutes = require('./routes/projectRoutes');
const designRoutes = require('./routes/designRoutes')
const homeCalculatorRoutes = require('./routes/homeCalculatorRoutes')
const wardrobeCalculatorRoutes = require('./routes/wardrobeCalculatorRoutes');
const kitchenCalculatorRoutes = require('./routes/kitchenCalculatorRoutes');
const contactRoutes = require('./routes/contactRoutes')
const app = express();

// Security & performance
app.use(helmet());
app.use(compression());
app.use('/api/', apiLimiter);
app.use(corsMiddleware);

//  Logging (only in development)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//  Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

//  Static files
app.use('/uploads', express.static('uploads'));
// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
    });
});

//  API routes
app.use('/api/projects', projectRoutes);
app.use('/api/design', designRoutes);
app.use('/api/price-calculators/home/calculator', homeCalculatorRoutes);
app.use('/api/price-calculators/wardrobe/calculator', wardrobeCalculatorRoutes);
app.use('/api/price-calculators/kitchen/calculator', kitchenCalculatorRoutes);

app.use('/api/contact', contactRoutes);
//  Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
