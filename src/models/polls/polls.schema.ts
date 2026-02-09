import { PaginationSchema } from "@models/common/common.schema";
import z from "zod";

export const PollStatusSchema = z.enum(['published', 'draft', 'closed']);

export const PollSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string(),
  code: z.string(),
  status: PollStatusSchema,
  workspace_id: z.uuid().nullable(),
  date_time_start: z.string().nullable(),
  date_time_end: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const GetPollSchema = PollSchema.extend({
  total_candidates: z.number(),
  total_participants: z.number(),
  total_positions: z.number(),
});

export const GetPollsPaginationSchema = PaginationSchema.extend({
  data: z.array(GetPollSchema),
});

export const GetPollsFilterSchema = z.object({
  q: z.string().optional(),
  status: PollStatusSchema.optional(),
  workspace_id: z.uuid().optional(),
});

export const PostPollSchema = PollSchema;
export const PatchPollSchema = PollSchema.omit({ id: true, created_at: true }).partial();
export const DeletePollSchema = z.object({
  id: z.uuid(),
});