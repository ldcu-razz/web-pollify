import { computed, inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Pagination } from "@models/common/common.type";
import { PatchPollCandidate, PollCandidate, PostPollCandidate } from "@models/polls/poll-candidate.type";
import { GetPollPosition } from "@models/polls/poll-positions.type";
import { patchState, signalStore, withComputed, withMethods, withProps, withState } from "@ngrx/signals";
import { PollCandidatesService } from "@services/poll-candidates.service";

interface PollCandidatesState {
  candidates: PollCandidate[];
  pagination: Pagination;
  loading: boolean;
  formLoading: boolean;
  updatingCandidate: boolean;
  deletingCandidate: boolean;
  error: string | null;
}

const initialState: PollCandidatesState = {
  candidates: [],
  pagination: {
    page: 1,
    limit: 25,
    total: 0,
  },
  loading: false,
  formLoading: false,
  updatingCandidate: false,
  deletingCandidate: false,
  error: null,
};

export const PollCandidatesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps(() => ({
    pollCandidatesService: inject(PollCandidatesService),
    snackbar: inject(MatSnackBar),
  })),
  withComputed(({ candidates }) => ({
    isCandidateNotEmpty: computed(() => candidates().length > 0),
  })),
  withMethods(({ pollCandidatesService, snackbar, ...store }) => ({
    getPollCandidates: async (pollId: string): Promise<void> => {
      if (store.isCandidateNotEmpty()) {
        return;
      }

      patchState(store, { loading: true });
      try {
        const result = await pollCandidatesService.getPollCandidates(pollId, store.pagination());
        patchState(store, { candidates: result.data, pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
        }, loading: false });
      } catch (error) {
        patchState(store, { error: error as string, loading: false });
        snackbar.open("Failed to get poll candidates", "Close", { duration: 3000 });
      }
    },

    createPollCandidate: async (pollId: string, payload: PostPollCandidate): Promise<void> => {
      patchState(store, { formLoading: true });
      try {
        const result = await pollCandidatesService.createPollCandidate(pollId, payload);
        patchState(store, { candidates: [result, ...store.candidates()], formLoading: false });
        snackbar.open("Poll candidate created successfully", "Close", { duration: 3000 });
      } catch (error) {
        patchState(store, { error: error as string, formLoading: false });
        snackbar.open("Failed to create poll candidate", "Close", { duration: 3000 });
      }
    },

    updatePollCandidate: async (pollCandidateId: string, payload: PatchPollCandidate): Promise<void> => {
      patchState(store, { formLoading: true });
      try {
        const result = await pollCandidatesService.updatePollCandidate(pollCandidateId, payload);
        patchState(store, { candidates: store.candidates().map(candidate => candidate.id === pollCandidateId ? result : candidate), formLoading: false });
        snackbar.open("Poll candidate updated successfully", "Close", { duration: 3000 });
      } catch (error) {
        patchState(store, { error: error as string, formLoading: false });
        snackbar.open("Failed to update poll candidate", "Close", { duration: 3000 });
      }
    },

    deletePollCandidate: async (pollCandidateId: string): Promise<void> => {
      patchState(store, { deletingCandidate: true });
      try {
        await pollCandidatesService.deletePollCandidate(pollCandidateId);
        patchState(store, { candidates: store.candidates().filter(candidate => candidate.id !== pollCandidateId), deletingCandidate: false });
        snackbar.open("Poll candidate deleted successfully", "Close", { duration: 3000 });
      } catch (error) {
        patchState(store, { error: error as string, deletingCandidate: false });
        snackbar.open("Failed to delete poll candidate", "Close", { duration: 3000 });
      }
    },

    setSelectedCandidate: (candidateId: string, position: GetPollPosition | null): void => {
      const candidate = store.candidates().find(candidate => candidate.id === candidateId);
      if (!candidate) {
        return;
      }

      const candidates = store.candidates().map(candidate => candidate.id === candidateId ? { ...candidate, poll_position: position ?? null, poll_position_id: position?.id ?? null } : candidate);
      patchState(store, { candidates });
    },

    resetPollCandidates: async (): Promise<void> => {
      patchState(store, {
        ...initialState,
      });
    }
  }))
);