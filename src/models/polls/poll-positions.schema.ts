import { PaginationSchema } from "@models/common/common.schema";
import z from "zod";
import { PollCandidateSchema } from "./poll-candidate.schema";


export const PollPositionsSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  position: z.number(),
  poll_id: z.uuid(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const GetPollPositionSchema = PollPositionsSchema.extend({
  poll_candidates: z.array(PollCandidateSchema),
});

export const GetPollPositionsPaginationSchema = PaginationSchema.extend({
  data: z.array(GetPollPositionSchema),
});

export const PostPollPositionSchema = PollPositionsSchema;
export const PatchPollPositionSchema = PollPositionsSchema.omit({ id: true, created_at: true }).partial();
export const DeletePollPositionSchema = z.object({
  id: z.uuid(),
});