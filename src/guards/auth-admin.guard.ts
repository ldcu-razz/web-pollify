import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { ROUTES as ROUTES_CONSTANTS } from "@constants/routes.constants";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthAdminStore } from "@store/auth/auth-admin.store";

export const authAdminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  const authAdminStore = inject(AuthAdminStore);
  const session = authAdminStore.getAdminSessionFromStorage();

  if (!session) {
    router.navigate([ROUTES_CONSTANTS.AUTH.LOGIN]);
    return false;
  }

  if (authAdminStore.isTokenExpired()) {
    snackBar.open('Session expired, please login again', 'Close', {
      duration: 3000,
      panelClass: 'error-snackbar',
    });
    authAdminStore.logout();
    return router.navigate([ROUTES_CONSTANTS.AUTH.LOGIN]);
  }

  return true;
};