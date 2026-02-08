import { PaginationSchema } from "@models/common/common.schema";
import { PollPositionsSchema } from "./poll-positions.schema";
import { z } from "zod";

export const PollCandidateSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  avatar: z.string().nullable(),
  description: z.string(),
  poll_position_id: z.uuid().nullable(),
  poll_id: z.uuid(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const GetPollCandidateSchema = PollCandidateSchema.extend({
  poll_position: PollPositionsSchema,
});
export const GetPollCandidatePaginationSchema = PaginationSchema.extend({
  data: z.array(GetPollCandidateSchema),
});
export const PostPollCandidateSchema = PollCandidateSchema;
export const PatchPollCandidateSchema = PollCandidateSchema.omit({ id: true, created_at: true }).partial();
export const DeletePollCandidateSchema = z.object({ id: z.uuid() });