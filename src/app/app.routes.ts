import { Routes } from '@angular/router';
import { ROUTES as ROUTES_CONSTANTS } from '@constants/routes.constants';

export const routes: Routes = [
  {
    path: '',
    redirectTo: ROUTES_CONSTANTS.AUTH.LOGIN,
    pathMatch: 'full',
  },
  {
    path: '',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: '',
    loadChildren: () => import('./main/main.module').then(m => m.MainModule),
  },
  {
    path: '',
    loadChildren: () => import('./participant/participant.module').then(m => m.ParticipantModule),
  }
];
