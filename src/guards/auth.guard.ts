import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { decodeJwt } from 'jose';
import { ROUTES as ROUTES_CONSTANTS } from '@constants/routes.constants';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const accessToken = sessionStorage.getItem('accessToken');

  if (!accessToken) {
    return true;
  }

  const decoded = decodeJwt(accessToken) as Record<string, unknown>;

  if (decoded['poll_participant_id']) {
    router.navigate([ROUTES_CONSTANTS.PARTICIPANT.BASE]);
    return false;
  }

  if (decoded['email']) {
    router.navigate([ROUTES_CONSTANTS.MAIN.BASE]);
    return false;
  }

  return true;
};