const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Package prices per square foot (in INR)
// Updated pricing structure
const packagePrices = {
  sliding: {
    basic: 1800,
    premium: 2500,
    luxury: 4500,
  },
  swing: {
    basic: 1500,
    premium: 2200,
    luxury: 4000,
  },
};

function calculateEstimate({ length, height, type, package: packageType }) {
  // Validate inputs
  if (!length || !height || !type || !packageType) {
    throw new Error(
      "Missing required wardrobe configuration: length, height, type, and package are required"
    );
  }

  if (typeof length !== "number" || length <= 0) {
    throw new Error("Length must be a positive number");
  }

  if (typeof height !== "number" || height <= 0) {
    throw new Error("Height must be a positive number");
  }

  if (!["sliding", "swing"].includes(type)) {
    throw new Error(`Invalid type: ${type}. Must be one of: sliding, swing`);
  }

  if (!["basic", "premium", "luxury"].includes(packageType)) {
    throw new Error(
      `Invalid package: ${packageType}. Must be one of: basic, premium, luxury`
    );
  }

  // Standard wardrobe width (depth) in feet
  const standardWidth = 2;

  // Calculate area in square feet (length × height × width)
  const area = length * height * standardWidth;

  // Get price per sqft based on type and package
  const pricePerSqFt = packagePrices[type][packageType];

  // Calculate estimated price
  const estimatedPrice = Math.round(area * pricePerSqFt);

  return {
    status: "success",
    estimatedPrice,
    breakdown: {
      length,
      height,
      width: standardWidth,
      area,
      type,
      package: packageType,
      pricePerSqFt,
    },
  };
}

async function saveEstimate({
  name,
  email,
  phone,
  propertyName,
  whatsappUpdates,
  estimate,
}) {
  try {
    // If estimate is not provided or missing price, calculate it
    let estimateData = estimate;
    if (!estimateData || !estimateData.estimatedPrice) {
      const calculation = calculateEstimate({
        length: estimateData?.length,
        height: estimateData?.height,
        type: estimateData?.type,
        package: estimateData?.package,
      });
      estimateData = {
        length: calculation.breakdown.length,
        height: calculation.breakdown.height,
        type: calculation.breakdown.type,
        package: calculation.breakdown.package,
        estimatedPrice: calculation.estimatedPrice,
      };
    }

    const record = await prisma.wardrobeEstimate.create({
      data: {
        name,
        email,
        phone,
        propertyName,
        whatsappUpdates: whatsappUpdates || false,
        height: estimateData.height?.toString() || null,
        type: estimateData.type,
        estimatedPrice: estimateData.estimatedPrice,
        finish: null, // Optional field - set to null since it's not needed
        material: null, // Optional field - set to null
        accessories: [], // Default empty array
        // Store length and package in a JSON field if schema supports it, or as separate fields
        // For now, we'll store what we can in existing fields
      },
    });

    return {
      status: "success",
      message: `Thank you ${name}! Your wardrobe estimate has been received.`,
      estimatedPrice: record.estimatedPrice,
      estimateId: record.id,
    };
  } catch (error) {
    throw new Error(`Failed to save wardrobe estimate: ${error.message}`);
  }
}

async function getAllEstimates(page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const [records, total] = await Promise.all([
    prisma.wardrobeEstimate.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.wardrobeEstimate.count(),
  ]);

  return {
    records,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

module.exports = { calculateEstimate, saveEstimate, getAllEstimates };
