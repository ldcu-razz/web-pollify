import { z } from "zod";
import { GetParticipantVoteSchema, PollPositionWithCandidateSchema } from "./participant-vote.schema";

export type GetParticipantVote = z.infer<typeof GetParticipantVoteSchema>;
export type PollPositionWithCandidate = z.infer<typeof PollPositionWithCandidateSchema>;