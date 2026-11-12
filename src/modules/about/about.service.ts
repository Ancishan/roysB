
import { prisma } from "../../prisma/prisma";

// ==========================================
// ABOUT PAGE SERVICE
// ==========================================

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

export const aboutService = {
  // ========================================
  // PUBLIC ABOUT PAGE
  // ========================================

  async getPublicAbout() {
    const about = await prisma.aboutPage.findUnique({
      where: {
        id: "main",
      },
      include: {
        teamMembers: {
          where: {
            isActive: true,
          },
          orderBy: [
            { displayOrder: "asc" },
            { createdAt: "asc" },
          ],
        },
        features: {
          where: {
            isActive: true,
          },
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
  // ADMIN GET ABOUT PAGE
  // ========================================

  async getAdminAbout() {
    return prisma.aboutPage.upsert({
      where: {
        id: "main",
      },
      update: {},
      create: {
        id: "main",
      },
      include: pageInclude,
    });
  },

  // ========================================
  // UPDATE ABOUT PAGE INFORMATION
  // ========================================

  async updateAboutPage(payload: Record<string, unknown>) {
    const data = {
      companyTitle:
        payload.companyTitle !== undefined
          ? getText(payload.companyTitle)
          : undefined,

      companySubtitle:
        payload.companySubtitle !== undefined
          ? getText(payload.companySubtitle)
          : undefined,

      heroImage:
        payload.heroImage !== undefined
          ? getText(payload.heroImage)
          : undefined,

      companyDescription:
        payload.companyDescription !== undefined
          ? getText(payload.companyDescription)
          : undefined,

      storyTitle:
        payload.storyTitle !== undefined
          ? getText(payload.storyTitle)
          : undefined,

      storyDescription:
        payload.storyDescription !== undefined
          ? getText(payload.storyDescription)
          : undefined,

      missionTitle:
        payload.missionTitle !== undefined
          ? getText(payload.missionTitle)
          : undefined,

      missionDescription:
        payload.missionDescription !== undefined
          ? getText(payload.missionDescription)
          : undefined,

      missionImage:
        payload.missionImage !== undefined
          ? getText(payload.missionImage)
          : undefined,

      visionTitle:
        payload.visionTitle !== undefined
          ? getText(payload.visionTitle)
          : undefined,

      visionDescription:
        payload.visionDescription !== undefined
          ? getText(payload.visionDescription)
          : undefined,

      visionImage:
        payload.visionImage !== undefined
          ? getText(payload.visionImage)
          : undefined,

      isActive:
        payload.isActive !== undefined
          ? Boolean(payload.isActive)
          : undefined,
    };

    return prisma.aboutPage.upsert({
      where: {
        id: "main",
      },
      update: data,
      create: {
        id: "main",
        companyTitle: getText(payload.companyTitle) || "About ROYS",
        ...data,
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

        email: getText(payload.email) || null,
        facebookUrl: getText(payload.facebookUrl) || null,
        linkedinUrl: getText(payload.linkedinUrl) || null,
        instagramUrl: getText(payload.instagramUrl) || null,

        displayOrder: Number(payload.displayOrder) || 0,

        isActive:
          payload.isActive === undefined
            ? true
            : Boolean(payload.isActive),
      },
    });
  },

  // ========================================
  // UPDATE TEAM MEMBER
  // ========================================

  async updateTeamMember(
    id: string,
    payload: Record<string, unknown>,
  ) {
    const data: Record<string, unknown> = {};

    const stringFields = [
      "name",
      "designation",
      "imageUrl",
      "bio",
      "email",
      "facebookUrl",
      "linkedinUrl",
      "instagramUrl",
    ];

    for (const field of stringFields) {
      if (payload[field] !== undefined) {
        const value = getText(payload[field]);

        data[field] = [
          "email",
          "facebookUrl",
          "linkedinUrl",
          "instagramUrl",
        ].includes(field)
          ? value || null
          : value;
      }
    }

    if (payload.roleType !== undefined) {
      data.roleType =
        payload.roleType === "GENERAL"
          ? "GENERAL"
          : "LEADERSHIP";
    }

    if (payload.displayOrder !== undefined) {
      data.displayOrder = Number(payload.displayOrder) || 0;
    }

    if (payload.isActive !== undefined) {
      data.isActive = Boolean(payload.isActive);
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
  // CREATE ABOUT FEATURE
  // ========================================

  async createFeature(payload: Record<string, unknown>) {
    const title = getText(payload.title);

    if (!title) {
      throw new Error("Feature title is required.");
    }

    return prisma.aboutFeature.create({
      data: {
        aboutPageId: "main",
        title,
        description: getText(payload.description),
        icon: getText(payload.icon) || "star",
        displayOrder: Number(payload.displayOrder) || 0,

        isActive:
          payload.isActive === undefined
            ? true
            : Boolean(payload.isActive),
      },
    });
  },

  // ========================================
  // UPDATE ABOUT FEATURE
  // ========================================

  async updateFeature(
    id: string,
    payload: Record<string, unknown>,
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
      data.displayOrder = Number(payload.displayOrder) || 0;
    }

    if (payload.isActive !== undefined) {
      data.isActive = Boolean(payload.isActive);
    }

    return prisma.aboutFeature.update({
      where: { id },
      data,
    });
  },

  // ========================================
  // DELETE ABOUT FEATURE
  // ========================================

  async deleteFeature(id: string) {
    return prisma.aboutFeature.delete({
      where: { id },
    });
  },
};
