const express = require('express');
const router = express.Router();
const {
    calculateEstimate,
    submitEstimate,
    getAllEstimates,
    validateEstimate,
    validateSubmit,
} = require('../controllers/kitchenCalculatorController');

// POST /api/price-calculators/kitchen/calculator/estimate
router.post('/estimate', validateEstimate, calculateEstimate);

// POST /api/price-calculators/kitchen/calculator/submit
router.post('/submit', validateSubmit, submitEstimate);

// GET /api/price-calculators/kitchen/calculator/estimates (Admin - optional)
router.get('/estimates', getAllEstimates);

module.exports = router;

