import z from "zod";
import { PollParticipantsSchema } from "./poll-participants.schema";
import { PollCandidateWithPartylistSchema } from "./poll-candidate.schema";
import { PollPositionsSchema } from "./poll-positions.schema";
import { PaginationSchema } from "@models/common/common.schema";
import { PollPartylistSchema } from "./poll-partylist.schema";

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
  poll_participant: PollParticipantsSchema.pick({ id: true, name: true, poll_status: true, rfid_number: true }),
  poll_candidate: PollCandidateWithPartylistSchema.pick({ id: true, name: true, poll_partylist: true}),
  poll_position: PollPositionsSchema.pick({ id: true, name: true}),
});

export const GetPollVotingsPaginatedSchema = PaginationSchema.extend({
  data: z.array(GetPollVotingSchema),
  total_votings: z.number(),
});

export const PostPollVotingSchema = PollVotingsSchema;
export const BulkPostPollVotingSchema = z.array(PostPollVotingSchema);
export const PatchPollVotingSchema = PollVotingsSchema.omit({ id: true, created_at: true }).partial();
export const DeletePollVotingSchema = z.object({ id: z.uuid() });

export const VotingPositionResultSchema = z.object({
  position: PollPositionsSchema.pick({ id: true, name: true }),
  candidates: z.array(z.object({
    id: z.uuid(),
    name: z.string(),
    poll_partylist: PollPartylistSchema.nullable(),
  })),
  votings: z.array(GetPollVotingSchema),
});