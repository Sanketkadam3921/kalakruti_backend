const { body, validationResult } = require('express-validator');
const wardrobeService = require('../services/wardrobeCalculatorService');

async function calculateEstimate(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid or missing fields',
                errors: errors.array(),
            });
        }

        const { length, height, type, package: packageType } = req.body;
        const result = wardrobeService.calculateEstimate({
            length,
            height,
            type,
            package: packageType,
        });

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

async function submitEstimate(req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid input data',
                errors: errors.array(),
            });
        }

        const { name, email, phone, propertyName, whatsappUpdates, estimate } = req.body;

        const result = await wardrobeService.saveEstimate({
            name,
            email,
            phone,
            propertyName,
            whatsappUpdates,
            estimate,
        });

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

async function getAllEstimates(req, res, next) {
    try {
        const { page = 1, limit = 10 } = req.query;
        const result = await wardrobeService.getAllEstimates(parseInt(page), parseInt(limit));
        res.status(200).json({
            status: 'success',
            ...result,
        });
    } catch (error) {
        next(error);
    }
}

// Validation middleware
const validateEstimate = [
    body('length')
        .notEmpty()
        .withMessage('Length is required')
        .isFloat({ min: 0.1 })
        .withMessage('Length must be a positive number'),
    body('height')
        .notEmpty()
        .withMessage('Height is required')
        .isFloat({ min: 0.1 })
        .withMessage('Height must be a positive number'),
    body('type')
        .notEmpty()
        .withMessage('Type is required')
        .isIn(['sliding', 'swing'])
        .withMessage('Type must be one of: sliding, swing'),
    body('package')
        .notEmpty()
        .withMessage('Package is required')
        .isIn(['basic', 'premium', 'luxury'])
        .withMessage('Package must be one of: basic, premium, luxury'),
];

const validateSubmit = [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('phone').matches(/^[6-9]\d{9}$/).withMessage('Provide a valid 10-digit Indian phone number'),
    body('propertyName').trim().isLength({ min: 2 }).withMessage('Property name must be at least 2 characters'),
    body('estimate').isObject().withMessage('Estimate must be an object'),
    body('estimate.length').isFloat({ min: 0.1 }).withMessage('Estimate length must be a positive number'),
    body('estimate.height').isFloat({ min: 0.1 }).withMessage('Estimate height must be a positive number'),
    body('estimate.type').notEmpty().withMessage('Estimate type is required'),
    body('estimate.package').notEmpty().withMessage('Estimate package is required'),
    body('estimate.estimatedPrice').isNumeric().withMessage('Estimated price must be a number'),
];

module.exports = {
    calculateEstimate,
    submitEstimate,
    getAllEstimates,
    validateEstimate,
    validateSubmit,
};
