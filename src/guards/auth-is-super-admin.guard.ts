import { AuthAdminStore } from "@store/auth/auth-admin.store";
import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { ROUTES as ROUTES_CONSTANTS } from "@constants/routes.constants";

export const authIsSuperAdminGuard: CanActivateFn = () => {
  const router = inject(Router)
  const authAdminStore = inject(AuthAdminStore);
  const isSuperAdmin = authAdminStore.isSuperAdmin();

  if (!isSuperAdmin) {
    return router.navigate([ROUTES_CONSTANTS.MAIN.BASE]);
  }

  return true;
};