-- CreateTable
CREATE TABLE "AboutPage" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "companyTitle" TEXT NOT NULL DEFAULT 'About ROYS',
    "companySubtitle" TEXT NOT NULL DEFAULT '',
    "heroImage" TEXT NOT NULL DEFAULT '',
    "companyDescription" TEXT NOT NULL DEFAULT '',
    "storyTitle" TEXT NOT NULL DEFAULT 'Our Story',
    "storyDescription" TEXT NOT NULL DEFAULT '',
    "missionTitle" TEXT NOT NULL DEFAULT 'Our Mission',
    "missionDescription" TEXT NOT NULL DEFAULT '',
    "missionImage" TEXT NOT NULL DEFAULT '',
    "visionTitle" TEXT NOT NULL DEFAULT 'Our Vision',
    "visionDescription" TEXT NOT NULL DEFAULT '',
    "visionImage" TEXT NOT NULL DEFAULT '',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "aboutPageId" TEXT NOT NULL DEFAULT 'main',
    "name" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "roleType" TEXT NOT NULL DEFAULT 'LEADERSHIP',
    "imageUrl" TEXT NOT NULL DEFAULT '',
    "bio" TEXT NOT NULL DEFAULT '',
    "email" TEXT,
    "facebookUrl" TEXT,
    "linkedinUrl" TEXT,
    "instagramUrl" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AboutFeature" (
    "id" TEXT NOT NULL,
    "aboutPageId" TEXT NOT NULL DEFAULT 'main',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "icon" TEXT NOT NULL DEFAULT 'star',
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutFeature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TeamMember_aboutPageId_idx" ON "TeamMember"("aboutPageId");

-- CreateIndex
CREATE INDEX "TeamMember_roleType_idx" ON "TeamMember"("roleType");

-- CreateIndex
CREATE INDEX "TeamMember_isActive_idx" ON "TeamMember"("isActive");

-- CreateIndex
CREATE INDEX "TeamMember_displayOrder_idx" ON "TeamMember"("displayOrder");

-- CreateIndex
CREATE INDEX "AboutFeature_aboutPageId_idx" ON "AboutFeature"("aboutPageId");

-- CreateIndex
CREATE INDEX "AboutFeature_isActive_idx" ON "AboutFeature"("isActive");

-- CreateIndex
CREATE INDEX "AboutFeature_displayOrder_idx" ON "AboutFeature"("displayOrder");

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_aboutPageId_fkey" FOREIGN KEY ("aboutPageId") REFERENCES "AboutPage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AboutFeature" ADD CONSTRAINT "AboutFeature_aboutPageId_fkey" FOREIGN KEY ("aboutPageId") REFERENCES "AboutPage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
