const kitchenCalculatorService = require('../services/kitchenCalculatorService');
const { body, validationResult } = require('express-validator');

class KitchenCalculatorController {
    /**
     * POST /api/price-calculators/kitchen/calculator/estimate
     * Calculate estimate based on configuration
     */
    async calculateEstimate(req, res, next) {
        try {
            // Validate request
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid or missing input fields',
                    errors: errors.array(),
                });
            }

            const { layout, A, B, C, package: packageType } = req.body;

            // Validate package type
            const validPackages = ['essentials', 'premium', 'luxe'];
            if (!validPackages.includes(packageType)) {
                return res.status(422).json({
                    status: 'error',
                    message: 'Invalid package type. Must be one of: essentials, premium, luxe',
                });
            }

            // Validate layout type
            const validLayouts = ['l-shaped', 'u-shaped', 'straight', 'parallel'];
            if (!validLayouts.includes(layout)) {
                return res.status(422).json({
                    status: 'error',
                    message: 'Invalid layout type. Must be one of: l-shaped, u-shaped, straight, parallel',
                });
            }

            // Validate dimensions
            if (!A || typeof A !== 'number' || A <= 0) {
                return res.status(422).json({
                    status: 'error',
                    message: 'Dimension A must be a positive number',
                });
            }

            // Calculate estimate
            const result = kitchenCalculatorService.calculateEstimate({
                layout,
                A,
                B: B || 0,
                C: C || 0,
                package: packageType,
            });

            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/price-calculators/kitchen/calculator/submit
     * Submit estimate with user details
     */
    async submitEstimate(req, res, next) {
        try {
            // Validate request
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Missing or invalid user details',
                    errors: errors.array(),
                });
            }

            const { name, email, phone, city, message, estimate } = req.body;

            // Validate estimate data
            if (!estimate || !estimate.layout || !estimate.package || estimate.A === undefined) {
                return res.status(422).json({
                    status: 'error',
                    message: 'Malformed estimate data. Layout, package, and dimension A are required',
                });
            }

            // Validate package type
            const validPackages = ['essentials', 'premium', 'luxe'];
            if (!validPackages.includes(estimate.package)) {
                return res.status(422).json({
                    status: 'error',
                    message: 'Invalid package type. Must be one of: essentials, premium, luxe',
                });
            }

            // Save estimate
            const result = await kitchenCalculatorService.saveEstimate({
                name,
                email,
                phone,
                city,
                message: message || null,
                estimate,
            });

            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/price-calculators/kitchen/calculator/estimates (Admin)
     * Get all submitted estimates
     */
    async getAllEstimates(req, res, next) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const result = await kitchenCalculatorService.getAllEstimates(
                parseInt(page),
                parseInt(limit)
            );

            return res.status(200).json({
                status: 'success',
                ...result,
            });
        } catch (error) {
            next(error);
        }
    }
}

// Validation middleware arrays
const validateEstimate = [
    body('layout')
        .notEmpty()
        .withMessage('Layout is required')
        .isIn(['l-shaped', 'u-shaped', 'straight', 'parallel'])
        .withMessage('Layout must be one of: l-shaped, u-shaped, straight, parallel'),
    body('A')
        .notEmpty()
        .withMessage('Dimension A is required')
        .isFloat({ min: 3, max: 20 })
        .withMessage('Dimension A must be between 3 and 20 feet'),
    body('B')
        .optional()
        .isFloat({ min: 3, max: 20 })
        .withMessage('Dimension B must be between 3 and 20 feet'),
    body('C')
        .optional()
        .isFloat({ min: 3, max: 20 })
        .withMessage('Dimension C must be between 3 and 20 feet'),
    body('package')
        .notEmpty()
        .withMessage('Package is required')
        .isIn(['essentials', 'premium', 'luxe'])
        .withMessage('Package must be one of: essentials, premium, luxe'),
];

const validateSubmit = [
    body('name')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters')
        .matches(/^[A-Za-z\s]+$/)
        .withMessage('Name can only contain letters and spaces'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('phone')
        .matches(/^[6-9]\d{9}$/)
        .withMessage('Please provide a valid 10-digit Indian phone number'),
    body('city')
        .trim()
        .isLength({ min: 2 })
        .withMessage('City must be at least 2 characters')
        .matches(/^[A-Za-z\s]+$/)
        .withMessage('City can only contain letters and spaces'),
    body('message').optional().trim(),
    body('estimate').isObject().withMessage('Estimate must be an object'),
    body('estimate.layout')
        .notEmpty()
        .withMessage('Estimate layout is required'),
    body('estimate.A')
        .notEmpty()
        .withMessage('Estimate dimension A is required')
        .isFloat({ min: 3, max: 20 })
        .withMessage('Estimate dimension A must be between 3 and 20 feet'),
    body('estimate.package')
        .notEmpty()
        .withMessage('Estimate package is required'),
    body('estimate.estimatedPrice')
        .optional()
        .isNumeric()
        .withMessage('Estimated price must be a number'),
];

const controller = new KitchenCalculatorController();

module.exports = {
    calculateEstimate: controller.calculateEstimate.bind(controller),
    submitEstimate: controller.submitEstimate.bind(controller),
    getAllEstimates: controller.getAllEstimates.bind(controller),
    validateEstimate,
    validateSubmit,
};

