import { z } from "zod";
import { PaginationSchema } from "../common/common.schema";

export const WorkspaceUserRolesSchema = z.enum(['admin', 'viewer']);

export const WorkspaceSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  avatar: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const GetWorkspaceSchema = WorkspaceSchema.extend({
  total_users: z.number(),
  total_polls: z.number(),
});
export const GetPaginatedWorkspacesSchema = PaginationSchema.extend({
  data: z.array(GetWorkspaceSchema),
});
export const GetPaginatedWorkspacesFilters = z.object({
  q: z.string().optional(),
});
export const PostWorkspaceSchema = WorkspaceSchema;
export const PutWorkspaceSchema = WorkspaceSchema.omit({ id: true, createdAt: true }).partial();
export const PatchWorkspaceSchema = WorkspaceSchema.omit({ id: true, createdAt: true }).partial();
export const DeleteWorkspaceSchema = WorkspaceSchema.pick({ id: true });