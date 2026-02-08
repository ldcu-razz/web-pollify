import { GetPollCandidatePaginationSchema, DeletePollCandidateSchema, PatchPollCandidateSchema, PollCandidateSchema, PostPollCandidateSchema, GetPollCandidateSchema } from "./poll-candidate.schema";
import { z } from "zod";

export type PollCandidate = z.infer<typeof PollCandidateSchema>;
export type GetPollCandidate = z.infer<typeof GetPollCandidateSchema>;
export type GetPollCandidatePagination = z.infer<typeof GetPollCandidatePaginationSchema>;
export type PostPollCandidate = z.infer<typeof PostPollCandidateSchema>;
export type PatchPollCandidate = z.infer<typeof PatchPollCandidateSchema>;
export type DeletePollCandidate = z.infer<typeof DeletePollCandidateSchema>;