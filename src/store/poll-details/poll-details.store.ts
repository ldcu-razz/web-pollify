import { inject } from "@angular/core";
import { PatchPoll, Poll } from "@models/polls/polls.type";
import { patchState, signalStore, withMethods, withProps, withState } from "@ngrx/signals";
import { PollDetailsService } from "@services/poll-details.service";
import { MatSnackBar } from "@angular/material/snack-bar";

interface PollDetailsState {
  poll: Poll | null;
  loading: boolean;
  updatingPoll: boolean;
  error: string | null;
}

const initialState: PollDetailsState = {
  poll: null,
  loading: false,
  updatingPoll: false,
  error: null,
}

export const PollDetailsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps(() => ({
    pollDetailsService: inject(PollDetailsService),
    snackbar: inject(MatSnackBar),
  })),
  withMethods(({ pollDetailsService, snackbar, ...store }) => ({
    getPollDetails: async (pollId: string): Promise<void> => {
      patchState(store, { loading: true });
      try {
        const result = await pollDetailsService.getPollDetails(pollId);
        patchState(store, { poll: result });
      } catch (error) {
        console.error(error);
      } finally {
        patchState(store, { loading: false });
      }
    },

    updatePoll: async (pollId: string, poll: PatchPoll): Promise<void> => {
      patchState(store, { updatingPoll: true });
      try {
        const result = await pollDetailsService.updatePoll(pollId, poll);
        patchState(store, { poll: result });
        snackbar.open('Poll updated successfully', 'Close', { duration: 3000 });
      } catch (error) {
        console.error(error);
        snackbar.open('Failed to update poll', 'Close', { duration: 3000 });
      } finally {
        patchState(store, { updatingPoll: false });
      }
    },

    setPollDuration: async (pollId: string, startDateTime: string, endDateTime: string): Promise<void> => {
      patchState(store, { updatingPoll: true });
      try {
        const result = await pollDetailsService.updatePoll(pollId, {
          date_time_start: startDateTime,
          date_time_end: endDateTime,
          updated_at: new Date().toISOString(),
        });
        patchState(store, { poll: { ...store.poll(), ...result } });
        snackbar.open('Poll duration set successfully', 'Close', { duration: 3000 });
      } catch (error) {
        console.error(error);
        snackbar.open('Failed to set poll duration', 'Close', { duration: 3000 });
      } finally {
        patchState(store, { updatingPoll: false });
      }
    },

    resetPollDuration: async (pollId: string): Promise<void> => {
      try {
        const result = await pollDetailsService.updatePoll(pollId, {
          date_time_start: null,
          date_time_end: null,
          updated_at: new Date().toISOString(),
        });
        patchState(store, { poll: { ...store.poll(), ...result } });
        snackbar.open('Poll duration reset successfully', 'Close', { duration: 3000 });
      } catch (error) {
        console.error(error);
        snackbar.open('Failed to reset poll duration', 'Close', { duration: 3000 });
      }
    },
    
    resetPollDetails: async (): Promise<void> => {
      patchState(store, {
        ...initialState,
      });
    }
  }))
)