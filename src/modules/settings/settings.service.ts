
import { prisma } from "../../prisma/prisma";
import type { UpdateSettingsData } from "./settings.validation";

const SETTINGS_ID = "main";

const getSettings = async () => {
  return prisma.storeSetting.upsert({
    where: { id: SETTINGS_ID },
    update: {},
    create: { id: SETTINGS_ID },
  });
};

const updateSettings = async (data: UpdateSettingsData) => {
  return prisma.storeSetting.upsert({
    where: { id: SETTINGS_ID },
    update: data,
    create: {
      id: SETTINGS_ID,
      ...data,
    },
  });
};

export const settingsService = {
  getSettings,
  updateSettings,
};
