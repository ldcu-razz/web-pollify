import { Routes } from "@angular/router";
import { MainComponent } from "./main.component";
import { WorkspacesComponent } from "../workspaces/workspaces.component";
import { ROUTES as ROUTES_CONSTANTS } from "@constants/routes.constants";
import { WorkspaceDetailsComponent } from "../workspace-details/workspace-details.component";
import { UsersComponent } from "../users/users.component";
import { workspacesResolver } from "src/resolvers/workspace.resolver";
import { UserDetailsComponent } from "../user-details/user-details.component";
import { GroupsComponent } from "../groups/groups.component";
import { GroupDetailsComponent } from "../group-details/group-details.component";
import { PollsComponent } from "../polls/polls.component";
import { PollDetailsComponent } from "../poll-details/poll-details.component";
import { PollDetailsOverviewComponent } from "../poll-details/poll-details-overview/poll-details-overview.component";
import { PollCandidatesComponent } from "../poll-details/poll-candidates/poll-candidates.component";
import { PollPositionsComponent } from "../poll-details/poll-positions/poll-positions.components";
import { PollParticipantsComponent } from "../poll-details/poll-participants/poll-participants.component";
import { PollVotingsComponent } from "../poll-details/poll-votings/poll-votings.component";
import { DashboardComponent } from "../dashboard/dashboard.component";
import { authAdminResolver } from "@resolvers/auth-admin.resolver";
import { authAdminGuard } from "src/guards/auth-admin.guard";
import { authIsSuperAdminGuard } from "src/guards/auth-is-super-admin.guard";
import { HomeComponent } from "../home/home.component";
import { ProfileComponent } from "../profile/profile.component";

export const mainRoutes: Routes = [
  {
    path: ROUTES_CONSTANTS.MAIN.BASE,
    component: MainComponent,
    resolve: {
      authAdmin: authAdminResolver,
      workspaces: workspacesResolver,
    },
    canActivate: [authAdminGuard],
    children: [
      {
        path: '',
        redirectTo: ROUTES_CONSTANTS.MAIN.HOME,
        pathMatch: 'full',
      },
      {
        path: '',
        redirectTo: ROUTES_CONSTANTS.MAIN.DASHBOARD,
        pathMatch: 'full',
      },
      {
        path: ROUTES_CONSTANTS.MAIN.HOME,
        component: HomeComponent,
      },
      {
        path: ROUTES_CONSTANTS.MAIN.DASHBOARD,
        component: DashboardComponent,
        canActivate: [authIsSuperAdminGuard],
      },
      {
        path: ROUTES_CONSTANTS.MAIN.POLLS,
        component: PollsComponent,
      },
      {
        path: `${ROUTES_CONSTANTS.MAIN.POLLS}/${ROUTES_CONSTANTS.MAIN.POLL_DETAILS}`,
        component: PollDetailsComponent,
        children: [
          {
            path: '',
            component: PollDetailsOverviewComponent,
          },
          {
            path: ROUTES_CONSTANTS.MAIN.POLL_DETAILS_CANDIDATES,
            component: PollCandidatesComponent,
          },
          {
            path: ROUTES_CONSTANTS.MAIN.POLL_DETAILS_POSITIONS,
            component: PollPositionsComponent,
          },
          {
            path: ROUTES_CONSTANTS.MAIN.POLL_DETAILS_PARTICIPANTS,
            component: PollParticipantsComponent,
          },
          {
            path: ROUTES_CONSTANTS.MAIN.POLL_DETAILS_VOTINGS,
            component: PollVotingsComponent,
          },
        ],
      },
      {
        path: ROUTES_CONSTANTS.MAIN.GROUPS,
        component: GroupsComponent
      },
      {
        path: `${ROUTES_CONSTANTS.MAIN.GROUPS}/${ROUTES_CONSTANTS.MAIN.GROUP_DETAILS}`,
        component: GroupDetailsComponent,
      },
      {
        path: ROUTES_CONSTANTS.MAIN.USERS,
        component: UsersComponent,
        canActivate: [authIsSuperAdminGuard],
      },
      {
        path: `${ROUTES_CONSTANTS.MAIN.USERS}/${ROUTES_CONSTANTS.MAIN.USER_DETAILS}`,
        component: UserDetailsComponent,
        canActivate: [authIsSuperAdminGuard],
      },
      {
        path: ROUTES_CONSTANTS.MAIN.WORKSPACES,
        component: WorkspacesComponent,
        canActivate: [authIsSuperAdminGuard],
      },
      {
        path: `${ROUTES_CONSTANTS.MAIN.WORKSPACES}/${ROUTES_CONSTANTS.MAIN.WORKSPACE_DETAILS}`,
        component: WorkspaceDetailsComponent,
        canActivate: [authIsSuperAdminGuard],
      },
      {
        path: ROUTES_CONSTANTS.MAIN.PROFILE,
        component: ProfileComponent,
      },
    ]
  }
];

export default mainRoutes;