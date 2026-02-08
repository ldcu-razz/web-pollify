import { computed, inject } from "@angular/core";
import { Pagination } from "@models/common/common.type";
import { GetGroup, GetGroupsFilter, PatchGroup, PostGroup } from "@models/groups/groups.type";
import { patchState, signalStore, withComputed, withMethods, withProps, withState } from "@ngrx/signals";
import { GroupsService } from "@services/groups.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { debounceTime, distinctUntilChanged, pipe, switchMap, tap } from "rxjs";
import { rxMethod } from "@ngrx/signals/rxjs-interop";

interface GroupsState {
  groups: GetGroup[];
  pagination: Pagination;
  loading: boolean;
  loadMoreLoading: boolean;
  searchQuery: string;
  searchLoading: boolean;
  formLoading: boolean;
  deletingGroupLoading: boolean;
  error: string | null;
  currentGroup: GetGroup | null;
  loadingUpdateGroup: boolean;
}

const initialState: GroupsState = {
  groups: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  loading: false,
  loadMoreLoading: false,
  searchQuery: '',
  searchLoading: false,
  formLoading: false,
  deletingGroupLoading: false,
  currentGroup: null,
  loadingUpdateGroup: false,
  error: null,
}

export const GroupsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps(() => ({
    groupsService: inject(GroupsService),
    snackbar: inject(MatSnackBar),
  })),
  withComputed((store) => ({
    groupMap: computed(() => new Map(store.groups().map(group => [group.id, group]))),
    groupsLengthReached: computed(() => store.groups().length >= store.pagination().total),
  })),
  withMethods(({ groupsService, snackbar, ...store }) => ({
    getGroups: async (pagination: Pagination, filters: GetGroupsFilter) => {
      patchState(store, { loading: true });
      try {
        const result = await groupsService.getGroups(pagination, filters);
        patchState(store, { groups: result.data, pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
        }}); 
      } catch (error) {
        patchState(store, { error: error as string});
        snackbar.open("Failed to get groups", "Close", { duration: 3000 });
      } finally {
        patchState(store, { loading: false });
      }
    },

    searchGroups: rxMethod<string>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap((query) => patchState(store, { searchQuery: query, searchLoading: true })),
        switchMap(async (query) => {
          const result = await groupsService.getGroups(store.pagination(), { q: query });
          patchState(store, { groups: result.data, pagination: {
            page: result.page,
            limit: result.limit,
            total: result.total,
          }, searchLoading: false });
        })
      )
    ),
    
    loadMoreGroups: async () => {
      patchState(store, { loadMoreLoading: true, pagination: {
        page: store.pagination().page,
        limit: store.pagination().limit + 10,
        total: store.pagination().total,
      } });
      try {
        const result = await groupsService.getGroups(store.pagination(), {});
        patchState(store, { groups: [...store.groups(), ...result.data], pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
        }, loadMoreLoading: false });
      } catch (error) {
        patchState(store, { error: error as string, loadMoreLoading: false });
      }
    },

    getGroup: async (groupId: string) => {
      patchState(store, { loading: true });
      try {
        const result = await groupsService.getGroup(groupId);
        patchState(store, { currentGroup: result, loading: false });
      } catch (error) {
        patchState(store, { error: error as string, loading: false });
        snackbar.open("Failed to get group", "Close", { duration: 3000 });
      }
    },

    createGroup: async (group: PostGroup) => {
      patchState(store, { formLoading: true });
      try {
        const result = await groupsService.createGroup(group);
        patchState(store, { groups: [...store.groups(), result], loading: false });
        snackbar.open("Group created successfully", "Close", { duration: 3000 });
      } catch (error) {
        patchState(store, { error: error as string, formLoading: false });
        snackbar.open("Failed to create group", "Close", { duration: 3000 });
      }
    },

    updateGroup: async (groupId: string, group: PatchGroup) => {
      patchState(store, { loadingUpdateGroup: true });
      try {
        const result = await groupsService.updateGroup(groupId, group);
        patchState(store, { currentGroup: result, loadingUpdateGroup: false });
        snackbar.open("Group updated successfully", "Close", { duration: 3000 });
      } catch (error) {
        patchState(store, { error: error as string, loadingUpdateGroup: false });
        snackbar.open("Failed to update group", "Close", { duration: 3000 });
      }
    },

    deleteGroup: async (groupId: string) => {
      patchState(store, { deletingGroupLoading: true });
      try {
        await groupsService.deleteGroup(groupId);
        patchState(store, { groups: store.groups().filter(group => group.id !== groupId), deletingGroupLoading: false });
        snackbar.open("Group deleted successfully", "Close", { duration: 3000 });
      } catch (error) {
        patchState(store, { error: error as string, deletingGroupLoading: false });
        snackbar.open("Failed to delete group", "Close", { duration: 3000 });
      }
    },
  })),
)