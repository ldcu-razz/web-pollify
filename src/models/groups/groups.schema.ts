import { PaginationSchema } from "@models/common/common.schema";
import { WorkspaceSchema } from "@models/workspace/workspace.schema";
import z from "zod";

export const GroupsSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  description: z.string().min(1),
  workspace_id: z.uuid(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const GetGroupsSchema = GroupsSchema.extend({
  workspace: WorkspaceSchema.pick({ id: true, name: true }),
});

export const GetPaginatedGroupsSchema = PaginationSchema.extend({
  data: z.array(GetGroupsSchema),
})

export const GetGroupsFilterSchema = z.object({
  q: z.string().optional(),
  workspace_id: z.uuid().optional(),
});

export const PostGroup = GroupsSchema;
export const PatchGroup = GroupsSchema.omit({ id: true, created_at: true }).partial();
export const DeleteGroup = z.object({
  id: z.uuid(),
});