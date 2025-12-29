const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class KitchenCalculatorService {
  // Package prices per square foot (in INR) - Layout-specific pricing
  layoutPackagePrices = {
    straight: {
      essentials: 2000,
      premium: 3200,
      luxe: 5200,
    },
    "l-shaped": {
      essentials: 2300,
      premium: 3400,
      luxe: 5800,
    },
    "u-shaped": {
      essentials: 2800,
      premium: 4300,
      luxe: 7000,
    },
    parallel: {
      essentials: 2500,
      premium: 3800,
      luxe: 6200,
    },
  };

  /**
   * Calculate linear feet based on layout type
   * Accounts for common areas where cabinets overlap
   * @param {String} layout - Layout type
   * @param {Number} A - Dimension A in feet
   * @param {Number} B - Dimension B in feet (optional)
   * @param {Number} C - Dimension C in feet (optional)
   * @param {Number} width - Kitchen width in feet (default: 2)
   * @returns {Number} Total linear feet
   */
  calculateLinearFeet(layout, A, B = 0, C = 0, width = 2) {
    switch (layout) {
      case "straight":
        // No common area, just A
        return A;
      case "l-shaped":
        // Subtract width from B due to common area at the corner
        return A + B - width;
      case "u-shaped":
        // Subtract width from 2 sides (B and C) due to common areas
        return A + B + C - 2 * width;
      case "parallel":
        // No common area, parallel sides
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

    if (!this.layoutPackagePrices[layout]) {
      throw new Error(
        `Invalid layout type: ${layout}. Must be one of: l-shaped, u-shaped, straight, parallel`
      );
    }

    if (!this.layoutPackagePrices[layout][packageType]) {
      throw new Error(
        `Invalid package type: ${packageType}. Must be one of: essentials, premium, luxe`
      );
    }

    // Validate dimensions based on layout
    if ((layout === "l-shaped" || layout === "parallel") && (!B || B <= 0)) {
      throw new Error(`Dimension B is required for ${layout} layout`);
    }

    if (layout === "u-shaped" && (!B || B <= 0 || !C || C <= 0)) {
      throw new Error("Dimensions B and C are required for U-shaped layout");
    }

    // Standard kitchen width (in feet)
    const assumedWidth = 2;

    // Calculate linear feet based on layout (accounts for common areas)
    const linearFeet = this.calculateLinearFeet(layout, A, B, C, assumedWidth);

    // Calculate area: linearFeet × assumedWidth
    const area = linearFeet * assumedWidth;

    // Get layout-specific package price per square foot
    const pricePerSqFt = this.layoutPackagePrices[layout][packageType];

    // Calculate final estimated price: area × pricePerSqFt
    const estimatedPrice = Math.round(area * pricePerSqFt);

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
      pricePerSqFt,
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
