import { inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Pagination } from "@models/common/common.type";
import { GetGroup, PatchGroup } from "@models/groups/groups.type";
import { BulkPostParticipants, GetParticipant, PostParticipants } from "@models/participants/participants.type";
import { patchState, signalStore, withMethods, withProps, withState } from "@ngrx/signals";
import { GroupDetailsService } from "@services/group-details.service";

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
}

const initialState: GroupDetailsState = {
  group: null,
  participants: [],
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
  deletingParticipantLoading: false,
  importingParticipantsLoading: false,
}

export const GroupDetailsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps(() => ({
    snackbar: inject(MatSnackBar),
    groupDetailsService: inject(GroupDetailsService),
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
        const result = await groupDetailsService.getGroupParticipants(pagination, groupId);
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

    resetGroupParticipants: (): void => {
      patchState(store, { participants: [], pagination: { page: 1, limit: 10, total: 0 } });
    },
  }))
)