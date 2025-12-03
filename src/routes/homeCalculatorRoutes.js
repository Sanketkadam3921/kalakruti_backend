const express = require('express');
const router = express.Router();
const {
    calculateEstimate,
    submitEstimate,
    getAllEstimates,
    validateEstimate,
    validateSubmit
} = require('../controllers/homeCalculatorController');

// POST /api/price-calculators/home/calculator/estimate
router.post('/estimate',
    validateEstimate,
    calculateEstimate
);

// POST /api/price-calculators/home/calculator/submit
router.post('/submit',
    validateSubmit,
    submitEstimate
);

// GET /api/price-calculators/home/calculator/estimates (Admin - optional)
router.get('/estimates', getAllEstimates);

module.exports = router;
