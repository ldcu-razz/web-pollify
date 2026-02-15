import { computed, inject } from "@angular/core";
import { AuthAdminSession } from "@models/auth/auth.type";
import { UserRolesSchema } from "@models/users/users.schema";
import { patchState, signalStore, withComputed, withMethods, withProps, withState } from "@ngrx/signals";
import { AuthService } from "@services/auth.service";
import { decodeJwt } from "jose";

interface AuthAdminState {
  accessToken: string | null;
  session: AuthAdminSession | null;
  logginInLoading: boolean;
  error: string | null;
}

const initialState: AuthAdminState = {
  accessToken: null,
  session: null,
  logginInLoading: false,
  error: null,
}

export const AuthAdminStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps(() => ({
    authService: inject(AuthService),
  })),
  withComputed((store) => ({
    isTokenExpired: computed(() => {
      return store.session()?.expires_at && new Date(store.session()?.expires_at ?? '') < new Date();
    }),
    workspaceId: computed(() => store.session()?.workspace_id ?? null),
    isAdmin: computed(() => store.session()?.role === UserRolesSchema.enum.admin),
    isSuperAdmin: computed(() => store.session()?.role === UserRolesSchema.enum.super_admin),
  })),
  withMethods((store) => ({
    loginAdmin: async (email: string, password: string): Promise<void> => {
      patchState(store, { logginInLoading: true });
      try {
        const accessToken = await store.authService.loginAdmin(email, password);
        sessionStorage.setItem('accessToken', accessToken.access_token);
        patchState(store, { accessToken: accessToken.access_token });
      } catch (error) {
        console.error(error);
      } finally {
        patchState(store, { logginInLoading: false });
      }
    },

    getAdminSessionFromStorage: (): AuthAdminSession | null => {
      const accessToken = sessionStorage.getItem('accessToken');
      if (!accessToken) {
        return null;
      }
      const decoded = decodeJwt(accessToken);
      if (decoded) {
        patchState(store, {
          session: decoded as AuthAdminSession,
          accessToken: accessToken,
        });
      }
      
      return decoded as AuthAdminSession;
    },

    logout: (): void => {
      sessionStorage.removeItem('accessToken');
      patchState(store, { accessToken: null, session: null });
    },
  }))
)
