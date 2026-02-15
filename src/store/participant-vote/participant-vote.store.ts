import { computed, inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { GetParticipantVote, PollPositionWithCandidate } from "@models/participants/participant-vote.type";
import { PollParticipantStatusSchema } from "@models/polls/poll-participants.schema";
import { BulkPostPollVoting, GetPollVoting } from "@models/polls/poll-votings.type";
import { patchState, signalStore, withComputed, withMethods, withProps, withState } from "@ngrx/signals";
import { ParticipantVoteService } from "@services/participant-vote.service";
import { AuthParticipantsStore } from "@store/auth/auth-participants.store";

interface ParticipantVoteState {
  participantVote: GetParticipantVote | null;
  participantVotings: GetPollVoting[];
  loading: boolean;
  submitVoteLoading: boolean;
  error: string | null;
}

const initialState: ParticipantVoteState = {
  participantVote: null,
  participantVotings: [],
  loading: false,
  submitVoteLoading: false,
  error: null,
}

export const ParticipantVoteStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps(() => ({
    participantVoteService: inject(ParticipantVoteService),
    authParticipantsStore: inject(AuthParticipantsStore),
    snackbar: inject(MatSnackBar),
  })),
  withComputed((store) => ({
    isParticipantVoteNotEmpty: computed(() => store.participantVote() !== null),
    pollPositionsWithCandidates: computed<PollPositionWithCandidate[]>(() => store.participantVote()?.poll_positions.map((position) => {
      return {
        position: position,
        candidates: store.participantVote()?.poll_candidates.filter((candidate) => candidate.poll_position_id === position.id) ?? [],
        poll_selected: {
          poll_position: '',
          poll_candidate: '',
        },
      }
    }) ?? []),
  })),
  withMethods(({ participantVoteService, authParticipantsStore, snackbar, ...store }) => ({
    getParticipantVote: async (pollId: string) => {
      patchState(store, { loading: true });
      try {
        const result = await participantVoteService.getParticipantVote(pollId);
        patchState(store, { participantVote: result, loading: false });
      } catch (error) {
        patchState(store, { error: error as string, loading: false });
      }
    },

    createParticipantVote: async (pollPositionsWithCandidates: PollPositionWithCandidate[]) => {
      patchState(store, { submitVoteLoading: true });
      try {
        const pollId = authParticipantsStore.session()?.poll_id ?? '';
        const pollParticipantId = authParticipantsStore.session()?.poll_participant_id ?? '';
        const payload: BulkPostPollVoting = pollPositionsWithCandidates.map((position) => {
          return {
            id: crypto.randomUUID(),
            poll_id: pollId,
            poll_participant_id: pollParticipantId,
            poll_position_id: position.position.id,
            poll_candidate_id: position.poll_selected.poll_candidate,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        });
        const result = await participantVoteService.createParticipantVote(pollParticipantId, payload);
        patchState(store, { submitVoteLoading: false, participantVotings: result });

        snackbar.open("Vote submitted successfully", "Close", { duration: 3000 });

        authParticipantsStore.setPollParticipantStatus(PollParticipantStatusSchema.enum.voted);
      } catch (error) {
        patchState(store, { error: error as string, submitVoteLoading: false });
      }
    },

    getParticipantVotings: async (participantId: string) => {
      patchState(store, { loading: true });
      try {
        const result = await participantVoteService.getParticipantVotings(participantId);
        patchState(store, { participantVotings: result, loading: false });
      } catch (error) {
        patchState(store, { error: error as string, loading: false });
      }
    },

    resetParticipantVote: () => {
      patchState(store, { ...initialState });
    },
  })),
)