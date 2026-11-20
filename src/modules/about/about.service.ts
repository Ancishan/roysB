
import { prisma } from "../../prisma/prisma";

const pageInclude = {
  teamMembers: {
    orderBy: [
      { displayOrder: "asc" as const },
      { createdAt: "asc" as const },
    ],
  },
  features: {
    orderBy: [
      { displayOrder: "asc" as const },
      { createdAt: "asc" as const },
    ],
  },
};

const getText = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

const getBoolean = (value: unknown, fallback = true): boolean => {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
};

const getNumber = (value: unknown): number => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const nullableText = (value: unknown): string | null =>
  getText(value) || null;

export const aboutService = {
  // ========================================
  // PUBLIC ABOUT PAGE
  // ========================================

  async getPublicAbout() {
    const about = await prisma.aboutPage.findUnique({
      where: { id: "main" },
      include: {
        teamMembers: {
          where: { isActive: true },
          orderBy: [
            { displayOrder: "asc" },
            { createdAt: "asc" },
          ],
        },
        features: {
          where: { isActive: true },
          orderBy: [
            { displayOrder: "asc" },
            { createdAt: "asc" },
          ],
        },
      },
    });

    if (!about || !about.isActive) {
      return null;
    }

    return about;
  },

  // ========================================
  // ADMIN ABOUT PAGE
  // ========================================

  async getAdminAbout() {
    return prisma.aboutPage.upsert({
      where: { id: "main" },
      update: {},
      create: { id: "main" },
      include: pageInclude,
    });
  },

  // ========================================
  // UPDATE ABOUT PAGE
  // ========================================

  async updateAboutPage(payload: Record<string, unknown>) {
    const fields = [
      "companyTitle",
      "companySubtitle",
      "heroImage",
      "companyDescription",
      "storyTitle",
      "storyDescription",
      "missionTitle",
      "missionDescription",
      "missionImage",
      "visionTitle",
      "visionDescription",
      "visionImage",
    ] as const;

    const data: Record<string, unknown> = {};

    for (const field of fields) {
      if (payload[field] !== undefined) {
        data[field] = getText(payload[field]);
      }
    }

    if (payload.isActive !== undefined) {
      data.isActive = getBoolean(payload.isActive);
    }

    return prisma.aboutPage.upsert({
      where: { id: "main" },
      update: data,
      create: {
        id: "main",
        ...data,
        companyTitle:
          getText(payload.companyTitle) || "About ROYS",
      },
      include: pageInclude,
    });
  },

  // ========================================
  // CREATE TEAM MEMBER
  // ========================================

  async createTeamMember(payload: Record<string, unknown>) {
    const name = getText(payload.name);
    const designation = getText(payload.designation);

    if (!name || !designation) {
      throw new Error("Name and designation are required.");
    }

    // Ensure the About page exists first.
    await prisma.aboutPage.upsert({
      where: { id: "main" },
      update: {},
      create: { id: "main" },
    });

    return prisma.teamMember.create({
      data: {
        aboutPageId: "main",
        name,
        designation,

        roleType:
          payload.roleType === "GENERAL"
            ? "GENERAL"
            : "LEADERSHIP",

        imageUrl: getText(payload.imageUrl),
        bio: getText(payload.bio),

        email: nullableText(payload.email),
        facebookUrl: nullableText(payload.facebookUrl),
        linkedinUrl: nullableText(payload.linkedinUrl),
        instagramUrl: nullableText(payload.instagramUrl),

        displayOrder: getNumber(payload.displayOrder),
        isActive: getBoolean(payload.isActive),
      },
    });
  },

  // ========================================
  // UPDATE TEAM MEMBER
  // ========================================

  async updateTeamMember(
    id: string,
    payload: Record<string, unknown>
  ) {
    const data: Record<string, unknown> = {};

    const stringFields = [
      "name",
      "designation",
      "imageUrl",
      "bio",
    ];

    for (const field of stringFields) {
      if (payload[field] !== undefined) {
        data[field] = getText(payload[field]);
      }
    }

    const nullableFields = [
      "email",
      "facebookUrl",
      "linkedinUrl",
      "instagramUrl",
    ];

    for (const field of nullableFields) {
      if (payload[field] !== undefined) {
        data[field] = nullableText(payload[field]);
      }
    }

    if (payload.roleType !== undefined) {
      data.roleType =
        payload.roleType === "GENERAL"
          ? "GENERAL"
          : "LEADERSHIP";
    }

    if (payload.displayOrder !== undefined) {
      data.displayOrder = getNumber(payload.displayOrder);
    }

    if (payload.isActive !== undefined) {
      data.isActive = getBoolean(payload.isActive);
    }

    return prisma.teamMember.update({
      where: { id },
      data,
    });
  },

  // ========================================
  // DELETE TEAM MEMBER
  // ========================================

  async deleteTeamMember(id: string) {
    return prisma.teamMember.delete({
      where: { id },
    });
  },

  // ========================================
  // CREATE GOAL / FEATURE
  // ========================================

  async createFeature(payload: Record<string, unknown>) {
    const title = getText(payload.title);

    if (!title) {
      throw new Error("Goal title is required.");
    }

    await prisma.aboutPage.upsert({
      where: { id: "main" },
      update: {},
      create: { id: "main" },
    });

    return prisma.aboutFeature.create({
      data: {
        aboutPageId: "main",
        title,
        description: getText(payload.description),
        icon: getText(payload.icon) || "target",
        displayOrder: getNumber(payload.displayOrder),
        isActive: getBoolean(payload.isActive),
      },
    });
  },

  // ========================================
  // UPDATE GOAL / FEATURE
  // ========================================

  async updateFeature(
    id: string,
    payload: Record<string, unknown>
  ) {
    const data: Record<string, unknown> = {};

    if (payload.title !== undefined) {
      data.title = getText(payload.title);
    }

    if (payload.description !== undefined) {
      data.description = getText(payload.description);
    }

    if (payload.icon !== undefined) {
      data.icon = getText(payload.icon);
    }

    if (payload.displayOrder !== undefined) {
      data.displayOrder = getNumber(payload.displayOrder);
    }

    if (payload.isActive !== undefined) {
      data.isActive = getBoolean(payload.isActive);
    }

    return prisma.aboutFeature.update({
      where: { id },
      data,
    });
  },

  // ========================================
  // DELETE GOAL / FEATURE
  // ========================================

  async deleteFeature(id: string) {
    return prisma.aboutFeature.delete({
      where: { id },
    });
  },
};
