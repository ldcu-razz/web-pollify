import { ResolveFn } from "@angular/router";
import { inject } from "@angular/core";
import { WorkspaceStore } from "@store/workspaces/workspace.store";

export const workspacesResolver: ResolveFn<boolean> = async () => {
  const workspaceStore = inject(WorkspaceStore);
  await workspaceStore.getWorkspaces(workspaceStore.pagination(), { q: workspaceStore.searchQuery() });
  return true;
};