import { Routes } from "@angular/router";
import { ParticipantComponent } from "./participant.component";
import { authParticipantsGuard } from "src/guards/auth-participants.guard";
import { authParticipantsResolver } from "@resolvers/auth-participants.resolver";
import { ParticipantVoteComponent } from "../participant-vote/participant-vote.component";
import { ROUTES as ROUTES_CONSTANTS } from "@constants/routes.constants";

export const participantRoutes: Routes = [
  {
    path: ROUTES_CONSTANTS.PARTICIPANT.BASE,
    component: ParticipantComponent,
    resolve: {
      authParticipants: authParticipantsResolver,
    },
    canActivate: [authParticipantsGuard],
    children: [
      {
        path: '',
        redirectTo: ROUTES_CONSTANTS.PARTICIPANT.VOTE,
        pathMatch: 'full',
      },
      {
        path: ROUTES_CONSTANTS.PARTICIPANT.VOTE,
        component: ParticipantVoteComponent,
      }
    ]
  },
];