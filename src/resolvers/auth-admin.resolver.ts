import { ResolveFn} from "@angular/router";
import { inject } from "@angular/core";
import { AuthAdminStore } from "@store/auth/auth-admin.store";

export const authAdminResolver: ResolveFn<boolean> = async () => {
  const authAdminStore = inject(AuthAdminStore);
  const session = authAdminStore.getAdminSessionFromStorage();

  if (!session) {
    return false;
  }

  return true;
};