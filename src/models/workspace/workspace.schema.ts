import { z } from "zod";
import { PaginationSchema } from "../common/common.schema";

export const WorkspaceUserRolesSchema = z.enum(['admin', 'viewer']);

export const WorkspaceSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  avatar: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GetWorkspaceSchema = WorkspaceSchema;
export const GetPaginatedWorkspacesSchema = PaginationSchema.extend({
  data: z.array(WorkspaceSchema),
});
export const PostWorkspaceSchema = WorkspaceSchema;
export const PutWorkspaceSchema = WorkspaceSchema;
export const PatchWorkspaceSchema = WorkspaceSchema.partial();
export const DeleteWorkspaceSchema = WorkspaceSchema.pick({ id: true });