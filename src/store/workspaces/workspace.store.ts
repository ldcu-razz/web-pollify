import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Pagination } from '@models/common/common.type';
import { GetPaginatedWorkspacesFilters, PostWorkspace, PutWorkspace, Workspace } from '@models/workspace/workspace.type';
import { signalStore, withProps, withState, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { WorkspacesService } from '@services/workspaces.service';
import { debounceTime, distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';

interface WorkspaceState {
  workspaces: Workspace[];
  pagination: Pagination;
  loading: boolean;
  searchQuery: string;
  searchLoading: boolean;
  formLoading: boolean;
  error: string | null;
  currentWorkspace: Workspace | null;
  currentWorkspaceLoading: boolean;
  deletingWorkspaceLoading: boolean;
}

const initialState: WorkspaceState = {
  workspaces: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  loading: false,
  searchQuery: '',
  searchLoading: false,
  formLoading: false,
  error: null,
  currentWorkspace: null,
  currentWorkspaceLoading: false,
  deletingWorkspaceLoading: false,
}

export const WorkspaceStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps(() => ({
    workspaceService: inject(WorkspacesService),
    snackBar: inject(MatSnackBar),
  })),
  withMethods(({ workspaceService, snackBar, ...store }) => ({
    getWorkspaces: async (payload: Pagination, filters: GetPaginatedWorkspacesFilters) => {
      patchState(store, { loading: true });
      const result = await workspaceService.getWorkspaces(payload, filters);
      patchState(store, { workspaces: result.data, pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
      }, loading: false });
    },

    createWorkspace: async (payload: PostWorkspace) => {
      patchState(store, { formLoading: true });
      const result = await workspaceService.createWorkspace(payload);
      patchState(store, { workspaces: [result, ...store.workspaces()], formLoading: false });
      snackBar.open("Workspace created successfully", "Close", { duration: 3000 });
    },

    updateWorkspace: async (workspaceId: string, payload: PutWorkspace) => {
      patchState(store, { formLoading: true });
      const currentWorkspace = store.currentWorkspace();
      const result = await workspaceService.updateWorkspace(workspaceId, payload);
      patchState(store, { currentWorkspace: { ...currentWorkspace, ...result }, formLoading: false });
      snackBar.open("Workspace updated successfully", "Close", { duration: 3000 });
    },

    getWorkspace: async (workspaceId: string) => {
      patchState(store, { currentWorkspaceLoading: true });
      const result = await workspaceService.getWorkspace(workspaceId);
      patchState(store, { currentWorkspace: result, currentWorkspaceLoading: false });
    },

    deleteWorkspace: async (workspaceId: string) => {
      patchState(store, { deletingWorkspaceLoading: true });
      await workspaceService.deleteWorkspace(workspaceId);
      patchState(store, { workspaces: store.workspaces().filter(workspace => workspace.id !== workspaceId), deletingWorkspaceLoading: false });
      snackBar.open("Workspace deleted successfully", "Close", { duration: 3000 });
    },

    searchWorkspaces: rxMethod<string>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap((query) => patchState(store, { searchQuery: query, searchLoading: true })),
        switchMap(async (query) => {
          const result = await workspaceService.getWorkspaces(store.pagination(), { q: query });
          patchState(store, { workspaces: result.data, pagination: {
            page: result.page,
            limit: result.limit,
            total: result.total,
          }, searchLoading: false });
        })
      )
    ),

    resetCurrentWorkspace: () => {
      patchState(store, { currentWorkspace: null });
    },
  }))
)