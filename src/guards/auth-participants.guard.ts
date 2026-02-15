import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthParticipantsStore } from "@store/auth/auth-participants.store";
import { ROUTES as ROUTES_CONSTANTS } from "@constants/routes.constants";
import { MatSnackBar } from "@angular/material/snack-bar";

export const authParticipantsGuard: CanActivateFn = () => {
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  const authParticipantsStore = inject(AuthParticipantsStore);
  const session = authParticipantsStore.getSessionFromStorage();

  if (!session) {
    router.navigate([ROUTES_CONSTANTS.AUTH.LOGIN]);
    return false;
  }

  if (authParticipantsStore.isTokenExpired()) {
    snackBar.open('Session expired, please login again', 'Close', {
      duration: 3000,
      panelClass: 'error-snackbar',
    });
    authParticipantsStore.logout();
    return router.navigate([ROUTES_CONSTANTS.AUTH.LOGIN]);
  }

  return true;
};