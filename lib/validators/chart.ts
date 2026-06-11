// lib/validators/chart.ts — Zod schemas for API validation

import { z } from 'zod';

// ─── Birth Info ───────────────────────────────────────────────

export const BirthInfoSchema = z.object({
  year: z.number().int().min(1900).max(2100),
  month: z.number().int().min(1).max(12),
  day: z.number().int().min(1).max(31),
  hour: z.number().int().min(0).max(11),
  gender: z.enum(['male', 'female']),
  name: z.string().max(255).optional(),
});

export type BirthInfoInput = z.infer<typeof BirthInfoSchema>;

// ─── Lunar Info ───────────────────────────────────────────────

export const LunarInfoSchema = z.object({
  lunarYear: z.number().int(),
  lunarMonth: z.number().int().min(1).max(13),
  lunarDay: z.number().int().min(1).max(30),
  yearStem: z.number().int().min(0).max(9),
  yearBranch: z.number().int().min(0).max(11),
  isLeapMonth: z.boolean(),
});

export type LunarInfoInput = z.infer<typeof LunarInfoSchema>;

// ─── Chart Data (partial, JSONB) ──────────────────────────────

export const ChartDataSchema = z.object({
  birthInfo: BirthInfoSchema,
  lunarInfo: LunarInfoSchema,
  mingGongBranch: z.number().int().min(0).max(11),
  shenGongBranch: z.number().int().min(0).max(11),
  wuxingJu: z.number().int().min(2).max(6),
  wuxingJuName: z.string(),
  ziweiPos: z.number().int().min(0).max(11),
  palaces: z.array(z.any()),
  daXians: z.array(z.any()),
  currentAge: z.number().int(),
  currentDaXianIndex: z.number().int(),
});

export type ChartDataInput = z.infer<typeof ChartDataSchema>;

// ─── Create Chart ────────────────────────────────────────────

export const CreateChartSchema = z.object({
  name: z.string().max(255).optional(),
  birth_info: BirthInfoSchema,
  lunar_info: LunarInfoSchema,
  chart_data: ChartDataSchema,
  is_public: z.boolean().default(false),
});

export type CreateChartInput = z.infer<typeof CreateChartSchema>;

// ─── Update Chart ────────────────────────────────────────────

export const UpdateChartSchema = z.object({
  name: z.string().max(255).optional(),
  is_public: z.boolean().optional(),
});

export type UpdateChartInput = z.infer<typeof UpdateChartSchema>;

// ─── User Settings ────────────────────────────────────────────

export const UpdateSettingsSchema = z.object({
  defaultGender: z.enum(['male', 'female']).optional(),
  defaultTheme: z.enum(['dark', 'light', 'system']).optional(),
  defaultShichen: z.number().int().min(0).max(11).optional(),
  sharePublic: z.boolean().optional(),
  aiInterpretation: z.boolean().optional(),
});

export type UpdateSettingsInput = z.infer<typeof UpdateSettingsSchema>;
