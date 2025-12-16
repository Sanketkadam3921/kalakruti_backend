const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class KitchenCalculatorService {
  // Package prices per square foot (in INR)
  // Using midpoint of ranges: Basic (₹1,500-₹2,500), Premium (₹2,500-₹4,000), Luxury (₹4,000-₹6,000)
  packagePrices = {
    essentials: 2000, // Basic: ₹1,500 - ₹2,500 per sqft (midpoint: ₹2,000)
    premium: 3250, // Premium: ₹2,500 - ₹4,000 per sqft (midpoint: ₹3,250)
    luxe: 5000, // Luxury: ₹4,000 - ₹6,000 per sqft (midpoint: ₹5,000)
  };

  // Layout multipliers
  layoutMultipliers = {
    "l-shaped": 1.2,
    "u-shaped": 1.5,
    straight: 1.0,
    parallel: 1.1,
  };

  /**
   * Calculate linear feet based on layout type
   * @param {String} layout - Layout type
   * @param {Number} A - Dimension A in feet
   * @param {Number} B - Dimension B in feet (optional)
   * @param {Number} C - Dimension C in feet (optional)
   * @returns {Number} Total linear feet
   */
  calculateLinearFeet(layout, A, B = 0, C = 0) {
    switch (layout) {
      case "straight":
        return A;
      case "l-shaped":
        return A + B;
      case "u-shaped":
        return A + B + C;
      case "parallel":
        return A + B;
      default:
        return A;
    }
  }

  /**
   * Calculate estimated price based on configuration
   * @param {Object} params - Calculation parameters
   * @param {String} params.layout - Layout type ("l-shaped", "u-shaped", "straight", "parallel")
   * @param {Number} params.A - Dimension A in feet
   * @param {Number} params.B - Dimension B in feet (optional)
   * @param {Number} params.C - Dimension C in feet (optional)
   * @param {String} params.package - Package type ("essentials", "premium", "luxe")
   * @returns {Object} Calculation result with breakdown
   */
  calculateEstimate({ layout, A, B = 0, C = 0, package: packageType }) {
    // Validate inputs
    if (!layout || !packageType || A === undefined || A <= 0) {
      throw new Error(
        "Missing required fields: layout, package, and A (dimension) are required"
      );
    }

    if (!this.packagePrices[packageType]) {
      throw new Error(
        `Invalid package type: ${packageType}. Must be one of: essentials, premium, luxe`
      );
    }

    if (!this.layoutMultipliers[layout]) {
      throw new Error(
        `Invalid layout type: ${layout}. Must be one of: l-shaped, u-shaped, straight, parallel`
      );
    }

    // Validate dimensions based on layout
    if ((layout === "l-shaped" || layout === "parallel") && (!B || B <= 0)) {
      throw new Error(`Dimension B is required for ${layout} layout`);
    }

    if (layout === "u-shaped" && (!B || B <= 0 || !C || C <= 0)) {
      throw new Error("Dimensions B and C are required for U-shaped layout");
    }

    // Calculate linear feet based on layout
    const linearFeet = this.calculateLinearFeet(layout, A, B, C);

    // Standard kitchen width assumption (in feet)
    const assumedWidth = 4;

    // Calculate area: linearFeet × assumedWidth
    const area = linearFeet * assumedWidth;

    // Get package price and layout multiplier
    const basePricePerSqFt = this.packagePrices[packageType];
    const layoutMultiplier = this.layoutMultipliers[layout];

    // Calculate final estimated price: area × pricePerSqFt × layoutMultiplier
    const estimatedPrice = Math.round(
      area * basePricePerSqFt * layoutMultiplier
    );

    return {
      status: "success",
      layout,
      dimensions: {
        A,
        B: layout !== "straight" ? B : null,
        C: layout === "u-shaped" ? C : null,
      },
      package: packageType,
      linearFeet,
      assumedWidth,
      area,
      basePricePerSqFt,
      layoutMultiplier,
      estimatedPrice,
    };
  }

  /**
   * Save estimate submission to database
   * @param {Object} data - Submission data
   * @param {String} data.name - User name
   * @param {String} data.email - User email
   * @param {String} data.phone - User phone
   * @param {String} data.city - User city
   * @param {String} data.message - Optional additional requirements
   * @param {Object} data.estimate - Estimate details (should include layout, A, B, C, package, estimatedPrice)
   * @returns {Object} Saved estimate record
   */
  async saveEstimate(data) {
    try {
      // If estimate is not provided or missing price, calculate it
      let estimateData = data.estimate;
      if (!estimateData || !estimateData.estimatedPrice) {
        const calculation = this.calculateEstimate({
          layout: estimateData?.layout,
          A: estimateData?.A,
          B: estimateData?.B || 0,
          C: estimateData?.C || 0,
          package: estimateData?.package,
        });
        estimateData = {
          layout: calculation.layout,
          A: calculation.dimensions.A,
          B: calculation.dimensions.B || null,
          C: calculation.dimensions.C || null,
          package: calculation.package,
          estimatedPrice: calculation.estimatedPrice,
        };
      }

      const estimate = await prisma.kitchenEstimate.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          city: data.city,
          message: data.message || null,
          layout: estimateData.layout,
          dimensionA: estimateData.A,
          dimensionB: estimateData.B || null,
          dimensionC: estimateData.C || null,
          packageType: estimateData.package,
          estimatedPrice: estimateData.estimatedPrice,
        },
      });

      return {
        status: "success",
        message: `Thank you ${
          data.name
        }! Your kitchen estimate is ₹${estimate.estimatedPrice.toLocaleString()}. We'll contact you soon.`,
        estimatedPrice: estimate.estimatedPrice,
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
      prisma.kitchenEstimate.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.kitchenEstimate.count(),
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

module.exports = new KitchenCalculatorService();
