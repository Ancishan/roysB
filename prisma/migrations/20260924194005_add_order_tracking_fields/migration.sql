-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "adminNote" TEXT,
ADD COLUMN     "campaignName" TEXT,
ADD COLUMN     "source" TEXT NOT NULL DEFAULT 'DIRECT';

-- CreateIndex
CREATE INDEX "Order_source_idx" ON "Order"("source");
