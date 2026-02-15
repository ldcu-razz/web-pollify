import { PollParticipantStatusSchema } from "@models/polls/poll-participants.schema";
import z from "zod";

export const AuthParticipantSessionSchema = z.object({
  poll_participant_id: z.string(),
  poll_participant_status: PollParticipantStatusSchema,
  name: z.string(),
  department: z.string(),
  code: z.string(),
  poll_id: z.string(),
  expires_at: z.string(),
});

export const LoginParticipantsSchema = z.object({
  rfid_number: z.string(),
  code: z.string(),
});

export const AuthAccessTokenSchema = z.object({
  access_token: z.string(),
});