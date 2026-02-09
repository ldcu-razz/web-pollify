import { z } from "zod";
import { GetPollVotingSchema, GetPollVotingsPaginatedSchema, PostPollVotingSchema, PatchPollVotingSchema, DeletePollVotingSchema, BulkPostPollVotingSchema, PollVotingsSchema, VotingPositionResultSchema } from "./poll-votings.schema";

export type PollVoting = z.infer<typeof PollVotingsSchema>;
export type GetPollVoting = z.infer<typeof GetPollVotingSchema>;
export type GetPollVotingsPaginated = z.infer<typeof GetPollVotingsPaginatedSchema>;
export type PostPollVoting = z.infer<typeof PostPollVotingSchema>;
export type BulkPostPollVoting = z.infer<typeof BulkPostPollVotingSchema>;
export type PatchPollVoting = z.infer<typeof PatchPollVotingSchema>;
export type DeletePollVoting = z.infer<typeof DeletePollVotingSchema>;
export type VotingPositionResult = z.infer<typeof VotingPositionResultSchema>;