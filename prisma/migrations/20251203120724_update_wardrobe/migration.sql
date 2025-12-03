-- AlterTable
ALTER TABLE "wardrobe_estimates" ALTER COLUMN "finish" DROP NOT NULL,
ALTER COLUMN "material" DROP NOT NULL,
ALTER COLUMN "accessories" SET DEFAULT ARRAY[]::TEXT[];
