import { GetPollParticipantsPaginationSchema, GetPollParticipantFiltersSchema, PollParticipantsSchema, GetPollParticipantSchema, PostPollParticipantsSchema, PatchPollParticipantsSchema, DeletePollParticipantsSchema, DeleteBulkPollParticipantsSchema, BulkPostPollParticipantsSchema } from "./poll-participants.schema";
import { z } from "zod";

export type PollParticipants = z.infer<typeof PollParticipantsSchema>;
export type GetPollParticipant = z.infer<typeof GetPollParticipantSchema>;
export type PostPollParticipants = z.infer<typeof PostPollParticipantsSchema>;
export type BulkPostPollParticipants = z.infer<typeof BulkPostPollParticipantsSchema>;
export type PatchPollParticipants = z.infer<typeof PatchPollParticipantsSchema>;
export type DeletePollParticipants = z.infer<typeof DeletePollParticipantsSchema>;
export type DeleteBulkPollParticipants = z.infer<typeof DeleteBulkPollParticipantsSchema>;
export type GetPollParticipantsPagination = z.infer<typeof GetPollParticipantsPaginationSchema>;
export type GetPollParticipantFilters = z.infer<typeof GetPollParticipantFiltersSchema>;