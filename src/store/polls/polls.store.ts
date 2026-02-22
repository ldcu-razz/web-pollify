import { inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Pagination } from "@models/common/common.type";
import { GetPollsFilter, PatchPoll, Poll, PostPoll } from "@models/polls/polls.type";
import { patchState, signalStore, withMethods, withProps, withState } from "@ngrx/signals";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { PollsService } from "@services/polls.service";
import { AuthAdminStore } from "@store/auth/auth-admin.store";
import { pipe } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap, tap } from "rxjs/operators";

interface PollState {
  polls: Poll[];
  pagination: Pagination;
  loading: boolean;
  searchQuery: string;
  searchLoading: boolean;
  formLoading: boolean;
  deletingPollLoading: boolean;
  currentPoll: Poll | null;
  error: string | null;
}

const initialState: PollState = {
  polls: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  loading: false,
  searchQuery: '',
  searchLoading: false,
  formLoading: false,
  deletingPollLoading: false,
  currentPoll: null,
  error: null,
}

export const PollStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps(() => ({
    pollsService: inject(PollsService),
    authAdminStore: inject(AuthAdminStore),
    snackbar: inject(MatSnackBar),
  })),
  withMethods(({ pollsService, authAdminStore, snackbar, ...store }) => ({
    getPolls: async (pagination: Pagination, filters: GetPollsFilter) => {
      patchState(store, { loading: true });
      try {
        const isSuperAdmin = authAdminStore.isSuperAdmin();
        const modifiedFilters = isSuperAdmin ? filters : { ...filters, workspace_id: authAdminStore.workspaceId() ?? undefined };
        const result = await pollsService.getPolls(pagination, modifiedFilters);
        patchState(store, { polls: result.data, pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
        }, loading: false });
      } catch (error) {
        patchState(store, { error: error as string, loading: false });
        snackbar.open("Failed to get polls", "Close", { duration: 3000 });
      }
    },

    getPoll: async (pollId: string) => {
      patchState(store, { loading: true });
      try {
        const result = await pollsService.getPoll(pollId);
        patchState(store, { currentPoll: result, loading: false });
      } catch (error) {
        patchState(store, { error: error as string, loading: false });
        snackbar.open("Failed to get poll", "Close", { duration: 3000 });
      }
    },

    searchPolls: rxMethod<GetPollsFilter>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap((filters) => patchState(store, { searchQuery: filters.q ?? '', searchLoading: true })),
        switchMap(async (filters) => {
          const isSuperAdmin = authAdminStore.isSuperAdmin();
          const modifiedFilters = isSuperAdmin ? filters : { ...filters, workspace_id: authAdminStore.workspaceId() ?? undefined };

          const result = await pollsService.getPolls(store.pagination(), modifiedFilters);
          patchState(store, { polls: result.data, pagination: {
            page: result.page,
            limit: result.limit,
            total: result.total,
          }, searchLoading: false });
        })
      )
    ),

    filterPoll: async (filters: GetPollsFilter) => {
      patchState(store, { loading: true });
      try {
        const result = await pollsService.getPolls(store.pagination(), filters);
        patchState(store, { polls: result.data, pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
        }, loading: false });
      } catch (error) {
        patchState(store, { error: error as string, loading: false });
        snackbar.open("Failed to filter polls", "Close", { duration: 3000 });
      }
    },

    createPoll: async (poll: PostPoll) => {
      patchState(store, { formLoading: true });
      try {
        const result = await pollsService.createPoll(poll);
        patchState(store, { polls: [result, ...store.polls()], formLoading: false });
        snackbar.open("Poll created successfully", "Close", { duration: 3000 });
      } catch (error) {
        patchState(store, { error: error as string, formLoading: false });
        snackbar.open("Failed to create poll", "Close", { duration: 3000 });
      }
    },

    updatePoll: async (pollId: string, poll: PatchPoll) => {
      patchState(store, { formLoading: true });
      try {
        const result = await pollsService.updatePoll(pollId, poll);
        patchState(store, { currentPoll: result, formLoading: false });
        snackbar.open("Poll updated successfully", "Close", { duration: 3000 });
      } catch (error) {
        patchState(store, { error: error as string, formLoading: false });
      }
    },

    deletePoll: async (pollId: string) => {
      patchState(store, { deletingPollLoading: true });
      try {
        await pollsService.deletePoll(pollId);
        patchState(store, { polls: store.polls().filter(poll => poll.id !== pollId), deletingPollLoading: false });
        snackbar.open("Poll deleted successfully", "Close", { duration: 3000 });
      } catch (error) {
        patchState(store, { error: error as string, deletingPollLoading: false });
        snackbar.open("Failed to delete poll", "Close", { duration: 3000 });
      }
    },
  }))
)