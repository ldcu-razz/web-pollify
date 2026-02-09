import { PaginationSchema } from "@models/common/common.schema";
import z from "zod";

export const PollParticipantStatusSchema = z.enum(['pending', 'done']);

export const PollParticipantsSchema = z.object({
  id: z.string(),
  rfid_number: z.string(),
  name: z.string(),
  department: z.string(),
  poll_status: PollParticipantStatusSchema,
  poll_id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const GetPollParticipantSchema = PollParticipantsSchema;
export const GetPollParticipantsPaginationSchema = PaginationSchema.extend({
  data: z.array(PollParticipantsSchema),
});
export const GetPollParticipantFiltersSchema = z.object({
  q: z.string().optional(),
});
export const PostPollParticipantsSchema = PollParticipantsSchema;
export const BulkPostPollParticipantsSchema = z.array(PostPollParticipantsSchema);
export const PatchPollParticipantsSchema = PollParticipantsSchema.omit({ id: true, created_at: true }).partial();
export const DeletePollParticipantsSchema = z.object({
  id: z.string(),
});
export const DeleteBulkPollParticipantsSchema = z.array(z.string());