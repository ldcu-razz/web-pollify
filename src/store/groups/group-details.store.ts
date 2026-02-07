import { computed, inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Pagination } from "@models/common/common.type";
import { GetGroup, PatchGroup } from "@models/groups/groups.type";
import { BulkPostParticipants, GetParticipant, PatchParticipants, PostParticipants } from "@models/participants/participants.type";
import { patchState, signalStore, withComputed, withMethods, withProps, withState } from "@ngrx/signals";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { GroupDetailsService } from "@services/group-details.service";
import { pipe } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap, tap } from "rxjs/operators";

interface GroupDetailsState {
  group: GetGroup | null;
  participants: GetParticipant[];
  pagination: Pagination;
  loading: boolean;
  loadMoreLoading: boolean;
  searchQuery: string;
  searchLoading: boolean;
  formLoading: boolean;
  deletingParticipantLoading: boolean;
  importingParticipantsLoading: boolean;
  currentParticipant: GetParticipant | null;
}

const initialState: GroupDetailsState = {
  group: null,
  participants: [],
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
  },
  loading: false,
  loadMoreLoading: false,
  searchQuery: '',
  searchLoading: false,
  formLoading: false,
  deletingParticipantLoading: false,
  importingParticipantsLoading: false,
  currentParticipant: null,
}

export const GroupDetailsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps(() => ({
    snackbar: inject(MatSnackBar),
    groupDetailsService: inject(GroupDetailsService),
  })),
  withComputed((store) => ({
    groupsLengthReached: computed(() => store.participants().length >= store.pagination().total),
  })),
  withMethods(({ groupDetailsService, snackbar, ...store }) => ({
    getGroupDetails: async (groupId: string): Promise<void> => {
      patchState(store, { loading: true });
      try {
        const result = await groupDetailsService.getGroupDetails(groupId);
        patchState(store, { group: result });
      } catch (error) {
        console.error(error);
      } finally {
        patchState(store, { loading: false });
      }
    },

    updateGroupDetails: async (groupId: string, payload: PatchGroup): Promise<void> => {
      patchState(store, { loading: true });
      try {
        const result = await groupDetailsService.updateGroupDetails(groupId, payload);
        patchState(store, { group: { ...store.group(), ...result } });
        snackbar.open('Group details updated successfully', 'Close', { duration: 3000 });
      } catch (error) {
        console.error(error);
      } finally {
        patchState(store, { loading: false });
      }
    },

    getGroupParticipants: async (pagination: Pagination, groupId: string): Promise<void> => {
      patchState(store, { loading: true });
      try {
        const result = await groupDetailsService.getGroupParticipants(pagination, { q: store.searchQuery() }, groupId);
        patchState(store, {
          participants: result.data,
          pagination: {
            page: result.page,
            limit: result.limit,
            total: result.total,
          },
        });
      } catch (error) {
        console.error(error);
      } finally {
        patchState(store, { loading: false });
      }
    },

    searchGroupParticipants: rxMethod<string>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap((query) => patchState(store, { searchQuery: query, searchLoading: true, pagination: { page: 1, limit: 20, total: 0 } })),
        switchMap(async (query) => {
          const result = await groupDetailsService.getGroupParticipants(store.pagination(), { q: query }, store.group()?.id ?? '');
          patchState(store, { participants: result.data, searchLoading: false });
        })
      )
    ),

    loadMoreGroupParticipants: async (): Promise<void> => {
      patchState(store, { loadMoreLoading: true });
      try {
        const pagination = {
          page: store.pagination().page + 1,
          limit: store.pagination().limit,
          total: store.pagination().total,
        };
        const result = await groupDetailsService.getGroupParticipants(pagination, { q: store.searchQuery() }, store.group()?.id ?? '');
        patchState(store, {
          participants: [...store.participants(), ...result.data],
          pagination: {
            page: result.page,
            limit: result.limit,
            total: result.total,
          },
        });
      } catch (error) {
        console.error(error);
      } finally {
        patchState(store, { loadMoreLoading: false });
      }
    },

    addGroupParticipant: async (payload: PostParticipants): Promise<void> => {
      patchState(store, { formLoading: true });
      try {
        const result = await groupDetailsService.createParticipant(payload);
        patchState(store, {
          participants: [...store.participants(), result],
        });
        snackbar.open('Participant added successfully', 'Close', { duration: 3000 });
      } catch (error) {
        console.error(error);
        snackbar.open('Failed to add participant', 'Close', { duration: 3000 });
      } finally {
        patchState(store, {
          formLoading: false,
        });
      }
    },

    importGroupParticipants: async (payload: BulkPostParticipants, groupId: string): Promise<void> => {
      patchState(store, { importingParticipantsLoading: true });
      try {
        const result = await groupDetailsService.bulkCreateParticipants(payload, groupId);
        patchState(store, {
          participants: [...store.participants(), ...result],
        });
        snackbar.open('Participants imported successfully', 'Close', { duration: 3000 });
      } catch (error) {
        console.error(error);
        snackbar.open('Failed to import participants', 'Close', { duration: 3000 });
      } finally {
        patchState(store, {
          importingParticipantsLoading: false,
        });
      }
    },

    deleteParticipant: async (participantId: string): Promise<void> => {
      patchState(store, { deletingParticipantLoading: true });
      try {
        await groupDetailsService.deleteParticipant(participantId);
        patchState(store, { participants: store.participants().filter(participant => participant.id !== participantId) });
      } catch (error) {
        console.error(error);
      } finally {
        patchState(store, { deletingParticipantLoading: false });
      }
    },

    updateGroupParticipant: async (participantId: string, payload: PatchParticipants): Promise<void> => {
      patchState(store, { formLoading: true });
      try {
        const result = await groupDetailsService.updateParticipant(participantId, payload);
        snackbar.open('Participant updated successfully', 'Close', { duration: 3000 });
        patchState(store, { participants: store.participants().map(participant => participant.id === participantId ? result : participant) });
      } catch (error) {
        console.error(error);
        snackbar.open('Failed to update participant', 'Close', { duration: 3000 });
      } finally {
        patchState(store, { formLoading: false });
      }
    },

    setSelectedParticipant: (participantId: string): void => {
      const participant = store.participants().find(participant => participant.id === participantId);
      if (!participant) {
        return;
      }
      patchState(store, { currentParticipant: participant });
    },

    resetGroupParticipants: (): void => {
      patchState(store, { participants: [], pagination: { page: 1, limit: 20, total: 0 } });
    },
  }))
)