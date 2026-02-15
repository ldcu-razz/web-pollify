import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthParticipantsStore } from '@store/auth/auth-participants.store';
import { ROUTES as ROUTES_CONSTANTS } from '@constants/routes.constants';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authParticipantsStore = inject(AuthParticipantsStore);
  const session = authParticipantsStore.getSessionFromStorage();

  if (!session) {
    return true;
  }

  router.navigate([ROUTES_CONSTANTS.PARTICIPANT.BASE]);
  return false;
};