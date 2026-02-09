import { computed, inject } from "@angular/core";
import { GetPoll, PatchPoll } from "@models/polls/polls.type";
import { patchState, signalStore, withComputed, withMethods, withProps, withState } from "@ngrx/signals";
import { PollDetailsService } from "@services/poll-details.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { PollStatusSchema } from "@models/polls/polls.schema";

interface PollDetailsState {
  poll: GetPoll | null;
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
  withComputed((store) => ({
    isPollPublished: computed(() => store.poll()?.status === PollStatusSchema.enum.published),
    isPollClosed: computed(() => store.poll()?.status === PollStatusSchema.enum.closed),
    isPollDraft: computed(() => store.poll()?.status === PollStatusSchema.enum.draft),
    isPollExceedToEndDateToday: computed(() => {
      const end = store.poll()?.date_time_end;
      if (!end) {
        return false;
      }
      const endDateAndTime = new Date(end);
      const now = new Date();
      return endDateAndTime.getTime() < now.getTime();
    }),
    isPollDurationValidTodaysTimeAndDate: computed(() => {
      const start = store.poll()?.date_time_start;
      const end = store.poll()?.date_time_end;

      if (!start || !end) {
        return false;
      }

      const now = new Date();
      const startDateAndTime = new Date(start);
      const endDateAndTime = new Date(end);

      const nowTime = now.getTime();
      return nowTime >= startDateAndTime.getTime() && nowTime <= endDateAndTime.getTime();
    }),
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

    udpateTotalCandidates: async (totalCandidates: number): Promise<void> => {
      const poll = store.poll();
      if (!poll) {
        return;
      }
      patchState(store, { poll: { ...poll, total_candidates: totalCandidates } });
    },

    udpateTotalParticipants: async (totalParticipants: number): Promise<void> => {
      const poll = store.poll();
      if (!poll) {
        return;
      }
      patchState(store, { poll: { ...poll, total_participants: totalParticipants } });
    },

    udpateTotalPositions: async (totalPositions: number): Promise<void> => {
      const poll = store.poll();
      if (!poll) {
        return;
      }
      patchState(store, { poll: { ...poll, total_positions: totalPositions } });
    },

    updatePoll: async (pollId: string, payload: PatchPoll): Promise<void> => {
      patchState(store, { updatingPoll: true });
      try {
        const result = await pollDetailsService.updatePoll(pollId, payload);
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
        patchState(store, { poll: result });
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
        patchState(store, { poll: result });
        snackbar.open('Poll duration reset successfully', 'Close', { duration: 3000 });
      } catch (error) {
        console.error(error);
        snackbar.open('Failed to reset poll duration', 'Close', { duration: 3000 });
      }
    },

    publishPoll: async (pollId: string): Promise<void> => {
      patchState(store, { updatingPoll: true });
      try {
        const result = await pollDetailsService.updatePoll(pollId, {
          status: PollStatusSchema.enum.published,
          updated_at: new Date().toISOString(),
        });
        patchState(store, { poll: result });
      } catch (error) {
        console.error(error);
        snackbar.open('Failed to publish poll', 'Close', { duration: 3000 });
      } finally {
        patchState(store, { updatingPoll: false });
      }
    },

    closePoll: async (pollId: string): Promise<void> => {
      patchState(store, { updatingPoll: true });
      try {
        const result = await pollDetailsService.updatePoll(pollId, {
          status: PollStatusSchema.enum.closed,
          updated_at: new Date().toISOString(),
        });
        patchState(store, { poll: result });
      } catch (error) {
        console.error(error);
        snackbar.open('Failed to close poll', 'Close', { duration: 3000 });
      } finally {
        patchState(store, { updatingPoll: false });
      }
    },

    resetPollDetails: async (): Promise<void> => {
      patchState(store, {
        ...initialState,
      });
    }
  }))
)