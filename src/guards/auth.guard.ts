import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { decodeJwt } from 'jose';
import { ROUTES as ROUTES_CONSTANTS } from '@constants/routes.constants';
import { UserRolesSchema } from '@models/users/users.schema';

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

  const role = decoded['role'] as string;
  if (role === UserRolesSchema.enum.admin) {
    router.navigate([ROUTES_CONSTANTS.MAIN.BASE, ROUTES_CONSTANTS.MAIN.HOME]);
    return false;
  }

  if (role === UserRolesSchema.enum.super_admin) {
    router.navigate([ROUTES_CONSTANTS.MAIN.BASE, ROUTES_CONSTANTS.MAIN.DASHBOARD]);
    return false;
  }

  return true;
};