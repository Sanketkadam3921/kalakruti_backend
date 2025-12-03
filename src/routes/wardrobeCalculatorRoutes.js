const express = require('express');
const router = express.Router();
const {
    calculateEstimate,
    submitEstimate,
    getAllEstimates,
    validateEstimate,
    validateSubmit,
} = require('../controllers/wardrobeCalculatorController');

// POST /api/price-calculators/wardrobe/calculator/estimate
router.post('/estimate', validateEstimate, calculateEstimate);

// POST /api/price-calculators/wardrobe/calculator/submit
router.post('/submit', validateSubmit, submitEstimate);

// GET /api/price-calculators/wardrobe/calculator/estimates
router.get('/estimates', getAllEstimates);

module.exports = router;
