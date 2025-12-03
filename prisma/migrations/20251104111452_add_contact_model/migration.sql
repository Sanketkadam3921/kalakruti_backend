-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('COMPLETED');

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "longDescription" TEXT,
    "location" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "bhk" TEXT NOT NULL,
    "pricing" TEXT NOT NULL,
    "budget" TEXT,
    "area" TEXT,
    "style" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'COMPLETED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_images" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "count" INTEGER,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "designs" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "style" TEXT,
    "price" TEXT,
    "image" TEXT,
    "description" TEXT,
    "specifications" JSONB,
    "sections" JSONB,
    "idealFor" TEXT,
    "images" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "designs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "home_estimates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "propertyName" TEXT NOT NULL,
    "bhk" TEXT NOT NULL,
    "size" TEXT,
    "packageType" TEXT NOT NULL,
    "estimatedPrice" INTEGER NOT NULL,
    "rooms" JSONB NOT NULL,
    "breakdown" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "home_estimates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wardrobe_estimates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "propertyName" TEXT NOT NULL,
    "whatsappUpdates" BOOLEAN NOT NULL DEFAULT false,
    "height" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "finish" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "accessories" TEXT[],
    "estimatedPrice" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wardrobe_estimates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kitchen_estimates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "message" TEXT,
    "layout" TEXT NOT NULL,
    "dimensionA" DOUBLE PRECISION NOT NULL,
    "dimensionB" DOUBLE PRECISION,
    "dimensionC" DOUBLE PRECISION,
    "packageType" TEXT NOT NULL,
    "estimatedPrice" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kitchen_estimates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "designs_slug_key" ON "designs"("slug");

-- AddForeignKey
ALTER TABLE "project_images" ADD CONSTRAINT "project_images_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "designs" ADD CONSTRAINT "designs_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
