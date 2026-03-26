import { computed, inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { patchState, signalStore, withComputed, withMethods, withProps, withState } from "@ngrx/signals";
import { PatchPollPartylist, GetPollPartylist, PostPollPartylist } from "@models/polls/poll-partylist.type";
import { PollPartylistService } from "@services/poll-partylist.service";

interface PollPartylistState {
  pollPartylists: GetPollPartylist[];
  loading: boolean;
  formLoading: boolean;
  updatingPollPartylist: boolean;
  deletingPollPartylist: boolean;
  error: string | null;
}

const initialState: PollPartylistState = {
  pollPartylists: [],
  loading: false,
  formLoading: false,
  updatingPollPartylist: false,
  deletingPollPartylist: false,
  error: null,
};

export const PollPartylistStore = signalStore(
  { providedIn: "root" },
  withState(initialState),
  withProps(() => ({
    pollPartylistService: inject(PollPartylistService),
    snackbar: inject(MatSnackBar),
  })),
  withComputed(({ pollPartylists }) => ({
    isPollPartyListNotEmpty: computed(() => pollPartylists().length > 0),
  })),
  withMethods(({ pollPartylistService, snackbar, ...store }) => ({
    getPollPartylists: async (pollId: string): Promise<void> => {
      if (store.isPollPartyListNotEmpty()) {
        return;
      }

      patchState(store, { loading: true });
      try {
        const result = await pollPartylistService.getPollPartylists(pollId);
        patchState(store, { pollPartylists: result, loading: false });
      } catch (error) {
        patchState(store, { error: error as string, loading: false });
        snackbar.open("Failed to get poll partylists", "Close", { duration: 3000 });
      }
    },

    createPollPartylist: async (payload: PostPollPartylist): Promise<void> => {
      patchState(store, { formLoading: true });
      try {
        const result = await pollPartylistService.createPollPartylist(payload);
        patchState(store, { pollPartylists: [result, ...store.pollPartylists()], formLoading: false });
        snackbar.open("Poll partylist created successfully", "Close", { duration: 3000 });
      } catch (error) {
        patchState(store, { error: error as string, formLoading: false });
        snackbar.open("Failed to create poll partylist", "Close", { duration: 3000 });
      }
    },

    updatePollPartylist: async (pollPartylistId: string, payload: PatchPollPartylist): Promise<void> => {
      patchState(store, { updatingPollPartylist: true });
      try {
        const result = await pollPartylistService.updatePollPartylist(pollPartylistId, payload);
        patchState(store, {
          pollPartylists: store.pollPartylists().map((partylist) => (partylist.id === pollPartylistId ? result : partylist)),
          updatingPollPartylist: false,
        });
        snackbar.open("Poll partylist updated successfully", "Close", { duration: 3000 });
      } catch (error) {
        patchState(store, { error: error as string, updatingPollPartylist: false });
        snackbar.open("Failed to update poll partylist", "Close", { duration: 3000 });
      } finally {
        patchState(store, { updatingPollPartylist: false });
      }
    },

    deletePollPartylist: async (pollPartylistId: string): Promise<void> => {
      patchState(store, { deletingPollPartylist: true });
      try {
        await pollPartylistService.deletePollPartylist(pollPartylistId);
        patchState(store, {
          pollPartylists: store.pollPartylists().filter((partylist) => partylist.id !== pollPartylistId),
          deletingPollPartylist: false,
        });
        snackbar.open("Poll partylist deleted successfully", "Close", { duration: 3000 });
      } catch (error) {
        patchState(store, { error: error as string, deletingPollPartylist: false });
        snackbar.open("Failed to delete poll partylist", "Close", { duration: 3000 });
      } finally {
        patchState(store, { deletingPollPartylist: false });
      }
    },

    resetPollPartylists: async (): Promise<void> => {
      patchState(store, { ...initialState });
    },
  }))
);

