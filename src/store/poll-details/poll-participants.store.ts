import { computed, inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Pagination } from "@models/common/common.type";
import { BulkPostPollParticipants, DeleteBulkPollParticipants, GetPollParticipant, PatchPollParticipants, PollParticipants, PostPollParticipants } from "@models/polls/poll-participants.type";
import { signalStore, withState, withProps, patchState, withMethods, withComputed } from "@ngrx/signals";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { PollParticipantsService } from "@services/poll-participants.service";
import { pipe, debounceTime, distinctUntilChanged, tap, switchMap } from "rxjs";
import { PollDetailsStore } from "./poll-details.store";
import { GetGroup } from "@models/groups/groups.type";
import { GroupsService } from "@services/groups.service";
import { PollParticipantStatusSchema } from "@models/polls/poll-participants.schema";

interface PollParticipantsState {
  pollParticipants: GetPollParticipant[];
  pagination: Pagination;
  searchQuery: string;
  loading: boolean;
  searchLoading: boolean;
  formLoading: boolean;
  loadMoreLoading: boolean;
  updatingParticipant: boolean;
  deletingParticipant: boolean;
  error: string | null;
  groupsSearchQuery: string;
  groupsSearchLoading: boolean;
  groups: GetGroup[];
  importingGroupParticipantsLoading: boolean;
}

const initialState: PollParticipantsState = {
  pollParticipants: [],
  pagination: {
    page: 1,
    limit: 500,
    total: 0,
  },
  searchQuery: '',
  loading: false,
  searchLoading: false,
  formLoading: false,
  loadMoreLoading: false,
  updatingParticipant: false,
  deletingParticipant: false,
  error: null,
  groupsSearchQuery: '',
  groupsSearchLoading: false,
  groups: [],
  importingGroupParticipantsLoading: false,
}

export const PollParticipantsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps(() => ({
    pollDetailsStore: inject(PollDetailsStore),
    pollParticipantsService: inject(PollParticipantsService),
    groupsService: inject(GroupsService),
    snackbar: inject(MatSnackBar),
  })),
  withComputed((store) => ({
    pollId: computed(() => store.pollDetailsStore.poll()?.id ?? ''),
  })),
  withMethods(({ pollDetailsStore, pollParticipantsService, groupsService, snackbar, ...store }) => ({
    getPollParticipants: async (): Promise<void> => {
      patchState(store, { loading: true });
      try {
        const result = await pollParticipantsService.getPollParticipants(store.pollId(), store.pagination(), { q: store.searchQuery() });
        patchState(store, { pollParticipants: result.data, pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
        }, loading: false });
      } catch (error) {
        console.error(error);
        snackbar.open("Failed to get poll participants", "Close", { duration: 3000 });
      } finally {
        patchState(store, { loading: false });
      }
    },

    searchPollParticipants: rxMethod<string>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap((query) => patchState(store, { searchQuery: query, searchLoading: true })),
        switchMap(async (query) => {
          const result = await pollParticipantsService.getPollParticipants(store.pollId(), store.pagination(), { q: query });
          patchState(store, { pollParticipants: result.data, pagination: {
            page: result.page,
            limit: result.limit,
            total: result.total,
          }, searchLoading: false });
        })
      )
    ),

    loadMorePollParticipants: async (): Promise<void> => {
      patchState(store, { loadMoreLoading: true });
      try {
        const pagination = {
          page: store.pagination().page + 1,
          limit: store.pagination().limit,
          total: store.pagination().total,
        };
        const result = await pollParticipantsService.getPollParticipants(store.pollId(), pagination, { q: store.searchQuery() });
        patchState(store, { pollParticipants: [...store.pollParticipants(), ...result.data], pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
        }, loadMoreLoading: false });
      } catch (error) {
        console.error(error);
      } finally {
        patchState(store, { loadMoreLoading: false });
      }
    },

    createPollParticipant: async (payload: PostPollParticipants): Promise<void> => {
      patchState(store, { formLoading: true });
      try {
        const participantLength = store.pollParticipants().length;

        const result = await pollParticipantsService.postPollParticipant(payload);
        patchState(store, { pollParticipants: [result, ...store.pollParticipants()], formLoading: false });
        snackbar.open("Poll participant added successfully", "Close", { duration: 3000 });

        pollDetailsStore.udpateTotalParticipants(participantLength + 1);
      } catch (error) {
        console.error(error);
        snackbar.open("Failed to add poll participant", "Close", { duration: 3000 });
      } finally {
        patchState(store, { formLoading: false });
      }
    },

    bulkCreatePollParticipants: async (payload: BulkPostPollParticipants): Promise<void> => {
      patchState(store, { formLoading: true });
      try {
        const participantLength = store.pollParticipants().length;

        const result = await pollParticipantsService.bulkPostPollParticipants(payload);
        patchState(store, { pollParticipants: [...store.pollParticipants(), ...result], formLoading: false });
        snackbar.open("Poll participants bulk created successfully", "Close", { duration: 3000 });

        pollDetailsStore.udpateTotalParticipants(participantLength + result.length);
      } catch (error) {
        console.error(error);
        snackbar.open("Failed to bulk create poll participants", "Close", { duration: 3000 });
      } finally {
        patchState(store, { formLoading: false });
      }
    },

    updatePollParticipant: async (pollParticipantId: string, payload: PatchPollParticipants): Promise<void> => {
      patchState(store, { formLoading: true });
      try {
        const result = await pollParticipantsService.patchPollParticipant(pollParticipantId, payload);
        patchState(store, { pollParticipants: store.pollParticipants().map(participant => participant.id === pollParticipantId ? result : participant), formLoading: false });
        snackbar.open("Poll participant updated successfully", "Close", { duration: 3000 });
      } catch (error) {
        console.error(error);
      } finally {
        patchState(store, { formLoading: false });
      }
    },

    deletePollParticipant: async (pollParticipantId: string): Promise<void> => {
      patchState(store, { deletingParticipant: true });
      try {
        const participantLength = store.pollParticipants().length;
        
        await pollParticipantsService.deletePollParticipant(pollParticipantId);
        patchState(store, { pollParticipants: store.pollParticipants().filter(participant => participant.id !== pollParticipantId), deletingParticipant: false });
        snackbar.open("Poll participant deleted successfully", "Close", { duration: 3000 });

        pollDetailsStore.udpateTotalParticipants(participantLength - 1);
      } catch (error) {
        console.error(error);
        snackbar.open("Failed to delete poll participant", "Close", { duration: 3000 });
      } finally {
        patchState(store, { deletingParticipant: false });
      }
    },

    deleteBulkPollParticipants: async (payload: DeleteBulkPollParticipants): Promise<void> => {
      patchState(store, { deletingParticipant: true });
      try {
        const participantLength = store.pollParticipants().length;

        const ids = payload;
        await pollParticipantsService.deleteBulkPollParticipants(ids);
        patchState(store, { pollParticipants: store.pollParticipants().filter(participant => !ids.includes(participant.id)), deletingParticipant: false });
        snackbar.open("Poll participants deleted successfully", "Close", { duration: 3000 });

        pollDetailsStore.udpateTotalParticipants(participantLength - ids.length);
      } catch (error) {
        console.error(error);
        snackbar.open("Failed to delete bulk poll participants", "Close", { duration: 3000 });
      } finally {
        patchState(store, { deletingParticipant: false });
      }
    },

    searchGroups: rxMethod<string>(
      pipe(
        debounceTime(300),
        tap((query) => patchState(store, { groupsSearchQuery: query, groupsSearchLoading: true })),
        switchMap(async (query) => {
          const pagination = {
            page: 1,
            limit: 5,
            total: 0,
          };
          const result = await groupsService.getGroups(pagination, { q: query });
          patchState(store, { groups: result.data, groupsSearchLoading: false });
        })
      )
    ),

    importGroupParticipants: async (groupId: string): Promise<void> => {
      patchState(store, { importingGroupParticipantsLoading: true });
      try {
        const participants = await pollParticipantsService.getGroupParticipants(groupId);
        const participantLength = store.pollParticipants().length;
        const newPollParticipants: PollParticipants[] = participants.map(participant => ({
          id: crypto.randomUUID(),
          rfid_number: participant.rfid_number,
          name: participant.name,
          department: participant.department,
          poll_status: PollParticipantStatusSchema.enum.pending,
          poll_id: store.pollId(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));

        const nonExistentPollParticipants = newPollParticipants.filter(participant => !store.pollParticipants().some(existingParticipant => existingParticipant.rfid_number === participant.rfid_number));

        const result = await pollParticipantsService.bulkPostPollParticipants(nonExistentPollParticipants);
        patchState(store, { pollParticipants: [...store.pollParticipants(), ...result], importingGroupParticipantsLoading: false });
        snackbar.open("Poll participants imported successfully", "Close", { duration: 3000 });

        pollDetailsStore.udpateTotalParticipants(participantLength + result.length);
      } catch (error) {
        console.error(error);
        snackbar.open("Failed to import poll participants", "Close", { duration: 3000 });
      } finally {
        patchState(store, { importingGroupParticipantsLoading: false });
      }
    },
    
    resetPollParticipants: () => {
      patchState(store, { ...initialState });
    }
  }))
)