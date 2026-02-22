import { computed, inject } from "@angular/core";
import { decodeJwt } from "jose";
import { AuthAccessToken, AuthParticipantSession } from "@models/auth/auth.type";
import { signalStore, withState, withProps, patchState, withMethods, withComputed } from "@ngrx/signals";
import { AuthService } from "@services/auth.service";
import { GetPollParticipant, PollParticipantStatus } from "@models/polls/poll-participants.type";

interface AuthParticipantsState {
  accessToken: string | null;
  session: AuthParticipantSession | null;
  logginInLoading: boolean;
  pollParticipant: GetPollParticipant | null;
  pollParticipantLoading: boolean;
  error: string | null;
}

const initialState: AuthParticipantsState = {
  accessToken: null,
  session: null,
  logginInLoading: false,
  pollParticipant: null,
  pollParticipantLoading: false,
  error: null,
}

export const AuthParticipantsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps(() => ({
    authService: inject(AuthService),
  })),
  withComputed((store) => ({
    isTokenExpired: computed(() => {
      return store.session()?.expires_at && new Date(store.session()?.expires_at ?? '') < new Date();
    }),
    pollParticipantStatus: computed(() => store.pollParticipant()?.poll_status ?? null),
  })),
  withMethods((store) => ({
    loginParticipants: async (rfidNumber: string, code: string): Promise<AuthAccessToken> => {
      patchState(store, { logginInLoading: true });
      try {
        const accessToken = await store.authService.loginParticipants(rfidNumber, code);
        sessionStorage.setItem('accessToken', accessToken.access_token);
        patchState(store, { accessToken: accessToken.access_token });
        return accessToken;
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        patchState(store, { logginInLoading: false });
      }
    },

    getSessionFromStorage: (): AuthParticipantSession | null => {
      const accessToken = sessionStorage.getItem('accessToken');
      if (!accessToken) {
        return null;
      }
      const decoded = decodeJwt(accessToken);
      if (decoded) {
        patchState(store, {
          session: decoded as AuthParticipantSession,
          accessToken: accessToken,
        });
      }
      
      return decoded as AuthParticipantSession;
    },

    getPollParticipant: async (pollParticipantId: string): Promise<void> => {
      patchState(store, { pollParticipantLoading: true });
      try {
        const pollParticipant = await store.authService.getPollParticipant(pollParticipantId);
        patchState(store, { pollParticipant });
      } catch (error) {
        console.error(error);
      } finally {
        patchState(store, { pollParticipantLoading: false });
      }
    },

    setPollParticipantStatus: (pollParticipantStatus: PollParticipantStatus): void => {
      const session = store.session();
      const pollParticipant = store.pollParticipant();
      if (session && pollParticipant) {
        patchState(store, {
          session: { ...session, poll_participant_status: pollParticipantStatus },
          pollParticipant: { ...pollParticipant, poll_status: pollParticipantStatus }
        });
      }
    },

    logout: async (): Promise<void> => {
      sessionStorage.removeItem('accessToken');
      patchState(store, { ...initialState });
    },

    resetAuthParticipantsState: (): void => {
      patchState(store, { ...initialState });
    },
  })),
);