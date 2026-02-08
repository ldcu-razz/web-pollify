import { z } from "zod";
import { DeletePollPositionSchema, GetPollPositionSchema, GetPollPositionsPaginationSchema, PatchPollPositionSchema, PollPositionsSchema, PostPollPositionSchema } from "./poll-positions.schema";

export type PollPosition = z.infer<typeof PollPositionsSchema>;
export type GetPollPosition = z.infer<typeof GetPollPositionSchema>;
export type GetPollPositionsPagination = z.infer<typeof GetPollPositionsPaginationSchema>;
export type PostPollPosition = z.infer<typeof PostPollPositionSchema>;
export type PatchPollPosition = z.infer<typeof PatchPollPositionSchema>;
export type DeletePollPosition = z.infer<typeof DeletePollPositionSchema>;