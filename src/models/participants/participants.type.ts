import { z } from "zod";
import { GetParticipantsPaginationSchema, BulkPostParticipantsSchema, PostParticipantsSchema, DeleteBulkParticipantsSchema, PatchParticipantsSchema, DeleteParticipantsSchema, ParticipantsSchema, GetParticipantSchema } from "./participants.schema";

export type Participants = z.infer<typeof ParticipantsSchema>;
export type GetParticipant = z.infer<typeof GetParticipantSchema>;
export type GetParticipantsPagination = z.infer<typeof GetParticipantsPaginationSchema>;
export type PostParticipants = z.infer<typeof PostParticipantsSchema>;
export type BulkPostParticipants = z.infer<typeof BulkPostParticipantsSchema>;
export type PatchParticipants = z.infer<typeof PatchParticipantsSchema>;
export type DeleteParticipants = z.infer<typeof DeleteParticipantsSchema>;
export type DeleteBulkParticipants = z.infer<typeof DeleteBulkParticipantsSchema>;