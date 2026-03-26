import { PatchPartyListSchema, GetPartyListSchema, PollPartylistSchema, PostPartyListSchema, DeletePartyListSchema } from "./poll-partylist.schema";
import { z } from "zod";

export type PollPartylist = z.infer<typeof PollPartylistSchema>;
export type GetPollPartylist = z.infer<typeof GetPartyListSchema>;
export type PostPollPartylist = z.infer<typeof PostPartyListSchema>;
export type PatchPollPartylist = z.infer<typeof PatchPartyListSchema>;
export type DeletePollPartylist = z.infer<typeof DeletePartyListSchema>;