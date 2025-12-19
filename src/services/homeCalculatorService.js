const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class HomeCalculatorService {
  // Price ranges in Lakhs (L) - converted to actual INR values
  // Format: { bhk: { package: { min: valueInLakhs, max: valueInLakhs } } }
  priceRanges = {
    "1bhk": {
      essentials: { min: 3, max: 4 }, // Basic: 3L-4L
      premium: { min: 5, max: 15 }, // Premium: 10L-18L
      luxe: { min: 18, max: 30 }, // Luxury: 18L-30L
    },
    "2bhk": {
      essentials: { min: 6, max: 10 }, // Basic: 6L-10L
      premium: { min: 10, max: 18 }, // Premium: 10L-18L
      luxe: { min: 18, max: 25 }, // Luxury: 18L-25L
    },
    "3bhk": {
      essentials: { min: 8, max: 12 }, // Basic: 8L-12L
      premium: { min: 12, max: 20 }, // Premium: 12L-20L
      luxe: { min: 20, max: 30 }, // Luxury: 20L-30L
    },
    "4bhk": {
      essentials: { min: 10, max: 15 }, // Basic: 10L-15L
      premium: { min: 15, max: 20 }, // Premium: 15L-20L
      luxe: { min: 20, max: 30, plus: true }, // Luxury: 20L-30L+
    },
    "5bhk": {
      essentials: { min: 25, max: 35 }, // Basic: 25L-35L
      premium: { min: 35, max: 45 }, // Premium: 35L-45L
      luxe: { min: 50, max: null, plus: true }, // Luxury: 50L+
    },
  };

  /**
   * Get price range for BHK and package
   * @param {String} bhk - BHK type (e.g., "1bhk", "2bhk")
   * @param {String} packageType - Package type ("essentials", "premium", "luxe")
   * @returns {Object} Price range with min, max, and formatted display
   */
  getPriceRange(bhk, packageType) {
    if (!this.priceRanges[bhk]) {
      throw new Error(`Invalid BHK type: ${bhk}`);
    }

    if (!this.priceRanges[bhk][packageType]) {
      throw new Error(`Invalid package type: ${packageType} for ${bhk}`);
    }

    const range = this.priceRanges[bhk][packageType];

    // Convert lakhs to actual INR (1 Lakh = 100,000)
    const minPrice = range.min * 100000;
    const maxPrice = range.max ? range.max * 100000 : null;

    // Format for display (e.g., "3L-4L" or "50L+")
    let displayRange;
    if (range.plus && !range.max) {
      displayRange = `${range.min}L+`;
    } else if (range.plus) {
      displayRange = `${range.min}L-${range.max}L+`;
    } else {
      displayRange = `${range.min}L-${range.max}L`;
    }

    return {
      min: minPrice,
      max: maxPrice,
      minLakhs: range.min,
      maxLakhs: range.max,
      displayRange: displayRange,
      hasPlus: range.plus || false,
    };
  }

  /**
   * Calculate estimated price based on configuration
   * @param {Object} params - Calculation parameters
   * @param {String} params.bhk - BHK type (e.g., "1bhk", "2bhk")
   * @param {String} params.size - Size type (deprecated, kept for backward compatibility)
   * @param {String} params.package - Package type ("essentials", "premium", "luxe")
   * @param {Object} params.rooms - Room counts object (kept for backward compatibility)
   * @returns {Object} Calculation result with price range
   */
  calculateEstimate({ bhk, size, package: packageType, rooms }) {
    // Validate inputs
    if (!bhk || !packageType) {
      throw new Error("Missing required fields: bhk and package are required");
    }

    // Get price range
    const priceRange = this.getPriceRange(bhk, packageType);

    return {
      status: "success",
      bhk,
      size: size || null,
      package: packageType,
      priceRange: {
        min: priceRange.min,
        max: priceRange.max,
        minLakhs: priceRange.minLakhs,
        maxLakhs: priceRange.maxLakhs,
        displayRange: priceRange.displayRange,
        hasPlus: priceRange.hasPlus,
      },
      // For backward compatibility, use midpoint as estimatedPrice
      estimatedPrice: priceRange.max
        ? Math.round((priceRange.min + priceRange.max) / 2)
        : priceRange.min,
    };
  }

  /**
   * Save estimate submission to database
   * @param {Object} data - Submission data
   * @param {String} data.name - User name
   * @param {String} data.email - User email
   * @param {String} data.phone - User phone
   * @param {String} data.propertyName - Property name
   * @param {Object} data.estimate - Estimate details (should include breakdown from calculateEstimate)
   * @returns {Object} Saved estimate record
   */
  async saveEstimate(data) {
    try {
      // Get price range for the estimate
      const calculation = this.calculateEstimate({
        bhk: data.estimate.bhk,
        size: data.estimate.size || null,
        package: data.estimate.package,
        rooms: data.estimate.rooms || {},
      });

      const estimate = await prisma.homeEstimate.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          propertyName: data.propertyName,
          bhk: data.estimate.bhk,
          size: data.estimate.size || null,
          packageType: data.estimate.package,
          estimatedPrice: calculation.estimatedPrice, // Use midpoint for storage
          rooms: data.estimate.rooms || {},
          breakdown: {
            priceRange: calculation.priceRange,
          },
        },
      });

      return {
        status: "success",
        message: `Thank you ${data.name}! Your home interior estimate is ${calculation.priceRange.displayRange}. We'll contact you soon.`,
        priceRange: calculation.priceRange,
        estimatedPrice: calculation.estimatedPrice,
        estimateId: estimate.id,
      };
    } catch (error) {
      throw new Error(`Failed to save estimate: ${error.message}`);
    }
  }

  /**
   * Get all estimates (for admin)
   * @param {Number} page - Page number
   * @param {Number} limit - Items per page
   * @returns {Object} Paginated estimates
   */
  async getAllEstimates(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [estimates, total] = await Promise.all([
      prisma.homeEstimate.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.homeEstimate.count(),
    ]);

    return {
      estimates,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

module.exports = new HomeCalculatorService();
