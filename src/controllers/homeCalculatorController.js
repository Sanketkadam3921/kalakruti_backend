const homeCalculatorService = require("../services/homeCalculatorService");
const { body, validationResult } = require("express-validator");

class HomeCalculatorController {
  /**
   * POST /api/price-calculators/home/calculator/estimate
   * Calculate estimate based on configuration
   */
  async calculateEstimate(req, res, next) {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: "error",
          message: "Invalid or missing input fields",
          errors: errors.array(),
        });
      }

      const { bhk, size, package: packageType, rooms } = req.body;

      // Validate room counts (optional, defaults will be used if not provided)
      if (rooms && typeof rooms !== "object") {
        return res.status(422).json({
          status: "error",
          message: "Invalid room counts provided",
        });
      }

      // Validate package type
      const validPackages = ["essentials", "premium", "luxe"];
      if (!validPackages.includes(packageType)) {
        return res.status(422).json({
          status: "error",
          message:
            "Invalid package type. Must be one of: essentials, premium, luxe",
        });
      }

      // Calculate estimate
      const result = homeCalculatorService.calculateEstimate({
        bhk,
        size,
        package: packageType,
        rooms,
      });

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/price-calculators/home/calculator/submit
   * Submit estimate with user details
   */
  async submitEstimate(req, res, next) {
    try {
      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: "error",
          message: "Missing or invalid user details",
          errors: errors.array(),
        });
      }

      const { name, email, phone, propertyName, estimate } = req.body;

      // Validate estimate data
      if (
        !estimate ||
        !estimate.bhk ||
        !estimate.package ||
        !estimate.estimatedPrice
      ) {
        return res.status(422).json({
          status: "error",
          message: "Malformed estimate data",
        });
      }

      // Save estimate
      const result = await homeCalculatorService.saveEstimate({
        name,
        email,
        phone,
        propertyName,
        estimate,
      });

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/price-calculators/home/calculator/estimates (Admin)
   * Get all submitted estimates
   */
  async getAllEstimates(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await homeCalculatorService.getAllEstimates(
        parseInt(page),
        parseInt(limit)
      );

      return res.status(200).json({
        status: "success",
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }
}

// Validation middleware arrays
const validateEstimate = [
  body("bhk").notEmpty().withMessage("BHK is required"),
  body("package").notEmpty().withMessage("Package is required"),
  body("rooms").isObject().withMessage("Rooms must be an object"),
  body("rooms.livingRoom")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Living room count must be a non-negative integer"),
  body("rooms.kitchen")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Kitchen count must be a non-negative integer"),
  body("rooms.bedroom")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Bedroom count must be a non-negative integer"),
  body("rooms.bathroom")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Bathroom count must be a non-negative integer"),
  body("rooms.dining")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Dining count must be a non-negative integer"),
];

const validateSubmit = [
  body("name")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("phone")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Please provide a valid 10-digit phone number"),
  body("propertyName")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Property name must be at least 2 characters"),
  body("estimate").isObject().withMessage("Estimate must be an object"),
  body("estimate.bhk").notEmpty().withMessage("Estimate BHK is required"),
  body("estimate.package")
    .notEmpty()
    .withMessage("Estimate package is required"),
  body("estimate.estimatedPrice")
    .isNumeric()
    .withMessage("Estimated price must be a number"),
];

const controller = new HomeCalculatorController();

module.exports = {
  calculateEstimate: controller.calculateEstimate.bind(controller),
  submitEstimate: controller.submitEstimate.bind(controller),
  getAllEstimates: controller.getAllEstimates.bind(controller),
  validateEstimate,
  validateSubmit,
};
