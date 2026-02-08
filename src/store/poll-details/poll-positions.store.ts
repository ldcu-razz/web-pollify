import { computed, inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Pagination } from "@models/common/common.type";
import { GetPollPosition, PatchPollPosition, PostPollPosition } from "@models/polls/poll-positions.type";
import { patchState, signalStore, withComputed, withMethods, withProps, withState } from "@ngrx/signals";
import { PollPositionsService } from "@services/poll-positions.service";
import { PollCandidatesStore } from "./poll-candidates.store";

interface PollPositionsState {
  pollPositions: GetPollPosition[];
  pagination: Pagination;
  loading: boolean;
  formLoading: boolean;
  updatingPollPosition: boolean;
  deletingPollPosition: boolean;
  error: string | null;
} 

const initialState: PollPositionsState = {
  pollPositions: [],
  pagination: {
    page: 1,
    limit: 25,
    total: 0,
  },
  loading: false,
  formLoading: false,
  updatingPollPosition: false,
  deletingPollPosition: false,
  error: null,
}

export const PollPositionsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps(() => ({
    pollPositionsService: inject(PollPositionsService),
    snackbar: inject(MatSnackBar),
    pollCandidatesStore: inject(PollCandidatesStore),
  })),
  withComputed(({ pollPositions }) => ({
    lastPositionNumber: computed(() => {
      const lastPosition = pollPositions().sort((a, b) => a.position - b.position).at(-1);
      return lastPosition?.position ? lastPosition.position + 1 : 1;
    }),
    sortedPollPositions: computed(() => pollPositions().sort((a, b) => a.position - b.position)),
    isPollPositionNotEmpty: computed(() => pollPositions().length > 0),
  })),
  withMethods(({ pollPositionsService, snackbar, pollCandidatesStore, ...store }) => ({
    getPollPositions: async (pollId: string): Promise<void> => {
      if (store.isPollPositionNotEmpty()) {
        return;
      }
      
      patchState(store, { loading: true });
      try {
        const result = await pollPositionsService.getPollPositions(pollId, store.pagination());
        patchState(store, { pollPositions: result.data, pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
        }, loading: false });
      } catch (error) {
        patchState(store, { error: error as string, loading: false });
        snackbar.open("Failed to get poll positions", "Close", { duration: 3000 });
      } finally {
        patchState(store, { loading: false });
      }
    },

    createPollPosition: async (payload: PostPollPosition, selectedCandidatesIds: string[]): Promise<void> => {
      patchState(store, { formLoading: true });
      try {
        const result = await pollPositionsService.createPollPosition(payload);
        patchState(store, { pollPositions: [result, ...store.pollPositions()], formLoading: false });

        const modifiedCandidatesResult = await pollPositionsService.modifyPollPositionCandidates(result.id, selectedCandidatesIds, []);
        patchState(store, { pollPositions: store.pollPositions().map(pollPosition => pollPosition.id === result.id ? { ...pollPosition, poll_candidates: modifiedCandidatesResult } : pollPosition), formLoading: false });
        selectedCandidatesIds.forEach(candidateId => pollCandidatesStore.setSelectedCandidate(candidateId, result ?? null));
        snackbar.open("Poll position created successfully", "Close", { duration: 3000 });
      } catch (error) {
        patchState(store, { error: error as string, formLoading: false });
        snackbar.open("Failed to create poll position", "Close", { duration: 3000 });
      }
    },

    updatePollPosition: async (pollPositionId: string, payload: PatchPollPosition): Promise<void> => {
      patchState(store, { updatingPollPosition: true });
      try {
        const result = await pollPositionsService.updatePollPosition(pollPositionId, payload);
        patchState(store, { pollPositions: store.pollPositions().map(pollPosition => pollPosition.id === pollPositionId ? result : pollPosition), updatingPollPosition: false });
        snackbar.open("Poll position updated successfully", "Close", { duration: 3000 });
      } catch (error) {
        patchState(store, { error: error as string, updatingPollPosition: false });
        snackbar.open("Failed to update poll position", "Close", { duration: 3000 });
      } finally {
        patchState(store, { updatingPollPosition: false });
      }
    },

    modifyPollPositionCandidates: async (pollPositionId: string, selectedPollCandidatesIds: string[], removedPollCandidatesIds: string[]): Promise<void> => {
      patchState(store, { formLoading: true });
      try {
        const updatedCandidatesIds = selectedPollCandidatesIds;
        const removedCandidatesIds = removedPollCandidatesIds;

        const result = await pollPositionsService.modifyPollPositionCandidates(pollPositionId, updatedCandidatesIds, removedCandidatesIds);
        patchState(store, { pollPositions: store.pollPositions().map(pollPosition => pollPosition.id === pollPositionId ? { ...pollPosition, poll_candidates: result } : pollPosition), formLoading: false });

        const pollPosition = store.pollPositions().find(pollPosition => pollPosition.id === pollPositionId);

        updatedCandidatesIds.forEach(candidateId => pollCandidatesStore.setSelectedCandidate(candidateId, pollPosition ?? null));
        removedCandidatesIds.forEach(candidateId => pollCandidatesStore.setSelectedCandidate(candidateId, null));
      } catch (error) {
        patchState(store, { error: error as string, formLoading: false, updatingPollPosition: false });
      }
      finally {
        patchState(store, { formLoading: false, updatingPollPosition: false });
      }
    },

    deletePollPosition: async (pollPositionId: string): Promise<void> => {
      patchState(store, { deletingPollPosition: true });
      try {
        const pollPosition = store.pollPositions().find(pollPosition => pollPosition.id === pollPositionId);
        
        await pollPositionsService.deletePollPosition(pollPositionId);
        patchState(store, { pollPositions: store.pollPositions().filter(pollPosition => pollPosition.id !== pollPositionId), deletingPollPosition: false });
        snackbar.open("Poll position deleted successfully", "Close", { duration: 3000 });

        const pollCandidates = pollPosition?.poll_candidates ?? [];
        pollCandidates.forEach(candidate => pollCandidatesStore.setSelectedCandidate(candidate.id, null));
      } catch (error) {
        patchState(store, { error: error as string, deletingPollPosition: false });
        snackbar.open("Failed to delete poll position", "Close", { duration: 3000 });
      } finally {
        patchState(store, { deletingPollPosition: false });
      }
    },

    resetPollPositions: async (): Promise<void> => {
      patchState(store, {
        ...initialState,
      });
    }
  })),
)