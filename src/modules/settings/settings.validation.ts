import { z } from "zod";

export const updateSettingsSchema = z.object({
  storeName: z.string().min(1).max(100).optional(),
  storeEmail: z.string().email().or(z.literal("")).optional(),
  storePhone: z.string().max(30).optional(),
  storeAddress: z.string().max(500).optional(),
  logoUrl: z.string().max(1000).optional(),

  deliveryCharge: z.number().min(0).optional(),
  freeShippingThreshold: z.number().min(0).optional(),

  codEnabled: z.boolean().optional(),
  onlinePaymentEnabled: z.boolean().optional(),

  maintenanceMode: z.boolean().optional(),
  announcementEnabled: z.boolean().optional(),
  announcementText: z.string().max(500).optional(),

  facebookUrl: z.string().max(1000).optional(),
  instagramUrl: z.string().max(1000).optional(),
  youtubeUrl: z.string().max(1000).optional(),
  tiktokUrl: z.string().max(1000).optional(),
});

export type UpdateSettingsData = z.infer<
  typeof updateSettingsSchema
>;