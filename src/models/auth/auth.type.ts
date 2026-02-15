import { AuthAccessTokenSchema, AuthParticipantSessionSchema, LoginParticipantsSchema } from "./auth.schema";
import { z } from "zod";

export type AuthParticipantSession = z.infer<typeof AuthParticipantSessionSchema>;
export type LoginParticipants = z.infer<typeof LoginParticipantsSchema>;
export type AuthAccessToken = z.infer<typeof AuthAccessTokenSchema>;