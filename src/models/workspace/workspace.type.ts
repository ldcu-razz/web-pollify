import { z } from "zod";
import { DeleteWorkspaceSchema, GetWorkspaceSchema, GetPaginatedWorkspacesSchema, GetPaginatedWorkspacesFilters, PatchWorkspaceSchema, PostWorkspaceSchema, PutWorkspaceSchema, WorkspaceSchema, WorkspaceUserRolesSchema } from "./workspace.schema";

export type Workspace = z.infer<typeof WorkspaceSchema>;
export type GetWorkspace = z.infer<typeof GetWorkspaceSchema>;
export type GetPaginatedWorkspaces = z.infer<typeof GetPaginatedWorkspacesSchema>;
export type GetPaginatedWorkspacesFilters = z.infer<typeof GetPaginatedWorkspacesFilters>;
export type PostWorkspace = z.infer<typeof PostWorkspaceSchema>;
export type PutWorkspace = z.infer<typeof PutWorkspaceSchema>;
export type PatchWorkspace = z.infer<typeof PatchWorkspaceSchema>;
export type DeleteWorkspace = z.infer<typeof DeleteWorkspaceSchema>;
export type WorkspaceUserRole = z.infer<typeof WorkspaceUserRolesSchema>;