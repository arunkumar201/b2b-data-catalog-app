-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "dataCategory" TEXT NOT NULL,
    "recordCount" INTEGER NOT NULL,
    "fields" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_data_category" ON "Product"("dataCategory");

-- CreateIndex
CREATE INDEX "idx_record_count" ON "Product"("recordCount");
