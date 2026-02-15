import { computed, inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Pagination } from "@models/common/common.type";
import { BulkPostPollVoting, GetPollVoting, PostPollVoting, VotingPositionResult } from "@models/polls/poll-votings.type";
import { signalStore, withState, withProps, withMethods, patchState, withComputed } from "@ngrx/signals";
import { PollVotingsService } from "@services/poll-votings.service";
import { PollPositionsStore } from "./poll-positions.store";
import { PollCandidatesStore } from "./poll-candidates.store";
import { PollDetailsStore } from "./poll-details.store";

interface PollVotingsState {
  votings: GetPollVoting[];
  pagination: Pagination;
  totalVotings: number;
  loading: boolean;
  formLoading: boolean;
  error: string | null;
  voting: GetPollVoting | null;
}

const initialState: PollVotingsState = {
  votings: [],
  pagination: {
    page: 1,
    limit: 100_000,
    total: 0,
  },
  totalVotings: 0,
  loading: false,
  formLoading: false,
  error: null,
  voting: null,
}

export const PollVotingsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps(() => ({
    pollDetailsStore: inject(PollDetailsStore),
    pollPositionsStore: inject(PollPositionsStore),
    pollCandidatesStore: inject(PollCandidatesStore),
    pollVotingsService: inject(PollVotingsService),
    snackbar: inject(MatSnackBar),
  })),
  withComputed(({ pollPositionsStore, pollCandidatesStore, votings }) => ({
    sortedPollPositions: computed(() => pollPositionsStore.sortedPollPositions()),
    votingPositionResults: computed(() => {
      const candidates = pollCandidatesStore.candidates();
      const results: VotingPositionResult[] = pollPositionsStore.sortedPollPositions().map(position => {
        const positionCandidates = candidates.filter(candidate => candidate.poll_position_id === position.id);
        return {
          position: {
            id: position.id,
            name: position.name,
          },
          candidates: positionCandidates.map(candidate => ({
            id: candidate.id,
            name: candidate.name,
          })),
          votings: votings().filter((voting) => voting.poll_position_id === position.id),
        }
      });

      return results;
    }),
  })),
  withMethods(({ pollVotingsService, pollDetailsStore, snackbar, ...store }) => ({
    getPollVotings: async (pollId: string): Promise<void> => {
      patchState(store, { loading: true });
      try {
        const result = await pollVotingsService.getPollVotings(pollId, store.pagination());
        patchState(store, { votings: result.data, totalVotings: result.total_votings, loading: false });
      } catch (error) {
        patchState(store, { error: error as string, loading: false });
        snackbar.open("Failed to get poll votings", "Close", { duration: 3000 });
      }
    },

    getPollVoting: async (id: string): Promise<void> => {
      patchState(store, { loading: true });
      try {
        const result = await pollVotingsService.getPollVoting(id);
        patchState(store, { voting: result, loading: false });
      } catch (error) {
        patchState(store, { error: error as string, loading: false });
        snackbar.open("Failed to get poll voting", "Close", { duration: 3000 });
      }
    },

    createPollVoting: async (payload: PostPollVoting): Promise<void> => {
      patchState(store, { formLoading: true });
      try {
        const result = await pollVotingsService.createPollVoting(payload);
        patchState(store, { votings: [result, ...store.votings()], formLoading: false });
        snackbar.open("Poll voting created successfully", "Close", { duration: 3000 });
      } catch (error) {
        patchState(store, { error: error as string, formLoading: false });
        snackbar.open("Failed to create poll voting", "Close", { duration: 3000 });
      }
    },

    bulkCreatePollVotings: async (payload: BulkPostPollVoting): Promise<void> => {
      patchState(store, { formLoading: true });
      try {
        const result = await pollVotingsService.bulkCreatePollVotings(payload);
        patchState(store, { votings: [...store.votings(), ...result], formLoading: false });
        snackbar.open("Poll votings bulk created successfully", "Close", { duration: 3000 });
      } catch (error) {
        patchState(store, { error: error as string, formLoading: false });
        snackbar.open("Failed to bulk create poll votings", "Close", { duration: 3000 });
      }
    },

    downloadTallyCsv: async (): Promise<void> => {
      try {
        const pollName = pollDetailsStore.poll()?.name ?? '';
        const filename = `${pollName}-tally-${new Date().toISOString().split('T')[0]}`;
        await pollVotingsService.dowmloadTallyCsv(filename, store.votingPositionResults());
      } catch (error) {
        patchState(store, { error: error as string, formLoading: false });
        snackbar.open("Failed to download tally csv", "Close", { duration: 3000 });
      }
    },
  })),
)