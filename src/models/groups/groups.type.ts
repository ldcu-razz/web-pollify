import { GetGroupsFilterSchema, GroupsSchema } from "./groups.schema";
import { GetGroupsSchema, GetPaginatedGroupsSchema, PostGroup, PatchGroup, DeleteGroup } from "./groups.schema";
import z from "zod";

export type Group = z.infer<typeof GroupsSchema>;
export type GetGroup = z.infer<typeof GetGroupsSchema>;
export type GetPaginatedGroups = z.infer<typeof GetPaginatedGroupsSchema>;
export type GetGroupsFilter = z.infer<typeof GetGroupsFilterSchema>;
export type PostGroup = z.infer<typeof PostGroup>;
export type PatchGroup = z.infer<typeof PatchGroup>;
export type DeleteGroup = z.infer<typeof DeleteGroup>;
