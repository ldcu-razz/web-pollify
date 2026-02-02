import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { ParticipantsComponent } from "./participants/participants.component";

const authRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
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