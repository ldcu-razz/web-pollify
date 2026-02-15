import { PollPositionsSchema } from "@models/polls/poll-positions.schema";
import { PollCandidateSchema } from "@models/polls/poll-candidate.schema";
import { z } from "zod";
import { PollSchema } from "@models/polls/polls.schema";

export const GetParticipantVoteSchema = z.object({
  pool: PollSchema,
  poll_positions: z.array(PollPositionsSchema),
  poll_candidates: z.array(PollCandidateSchema),
});

export const PollPositionWithCandidateSchema = z.object({
  position: PollPositionsSchema,
  candidates: z.array(PollCandidateSchema),
  poll_selected: z.object({
    poll_position: z.string(),
    poll_candidate: z.string(),
  }),
});