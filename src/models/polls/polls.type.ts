import { z } from "zod";
import { DeletePollSchema, GetPollsFilterSchema, GetPollsPaginationSchema, GetPollSchema, PatchPollSchema, PollSchema, PostPollSchema } from "./polls.schema";

export type Poll = z.infer<typeof PollSchema>;
export type GetPoll = z.infer<typeof GetPollSchema>;
export type GetPollsPagination = z.infer<typeof GetPollsPaginationSchema>;
export type GetPollsFilter = z.infer<typeof GetPollsFilterSchema>;
export type PostPoll = z.infer<typeof PostPollSchema>;
export type PatchPoll = z.infer<typeof PatchPollSchema>;
export type DeletePoll = z.infer<typeof DeletePollSchema>;