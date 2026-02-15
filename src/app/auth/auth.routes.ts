import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { ParticipantsComponent } from "./participants/participants.component";
import { authGuard } from "src/guards/auth.guard";

const authRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [authGuard],
  },
  {
    path: 'login',
    children: [
      {
        path: 'participants',
        component: ParticipantsComponent
      }
    ]
  }
];

export default authRoutes;