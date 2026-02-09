import z from "zod";
import { PollParticipantsSchema } from "./poll-participants.schema";
import { PollCandidateSchema } from "./poll-candidate.schema";
import { PollPositionsSchema } from "./poll-positions.schema";
import { PaginationSchema } from "@models/common/common.schema";

export const PollVotingsSchema = z.object({
  id: z.uuid(),
  poll_id: z.uuid(),
  poll_participant_id: z.uuid(),
  poll_candidate_id: z.uuid(),
  poll_position_id: z.uuid(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const GetPollVotingSchema = PollVotingsSchema.extend({
  poll_participant: PollParticipantsSchema.pick({ id: true, name: true, poll_status: true }),
  poll_candidate: PollCandidateSchema.pick({ id: true, name: true}),
  poll_position: PollPositionsSchema.pick({ id: true, name: true}),
});

export const GetPollVotingsPaginatedSchema = PaginationSchema.extend({
  data: z.array(GetPollVotingSchema),
});

export const PostPollVotingSchema = PollVotingsSchema;
export const BulkPostPollVotingSchema = z.array(PostPollVotingSchema);
export const PatchPollVotingSchema = PollVotingsSchema.omit({ id: true, created_at: true }).partial();
export const DeletePollVotingSchema = z.object({ id: z.uuid() });

export const VotingPositionResultSchema = z.object({
  position: PollPositionsSchema.pick({ id: true, name: true }),
  candidates: z.array(PollCandidateSchema.pick({ id: true, name: true })),
  votings: z.array(PollVotingsSchema),
});