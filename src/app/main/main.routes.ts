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

export const mainRoutes: Routes = [
  {
    path: ROUTES_CONSTANTS.MAIN.BASE,
    component: MainComponent,
    resolve: {
      workspaces: workspacesResolver,
    },
    children: [
      {
        path: ROUTES_CONSTANTS.MAIN.USERS,
        component: UsersComponent,
      },
      {
        path: `${ROUTES_CONSTANTS.MAIN.USERS}/${ROUTES_CONSTANTS.MAIN.USER_DETAILS}`,
        component: UserDetailsComponent,
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
        path: ROUTES_CONSTANTS.MAIN.WORKSPACES,
        component: WorkspacesComponent,
      },
      {
        path: `${ROUTES_CONSTANTS.MAIN.WORKSPACES}/${ROUTES_CONSTANTS.MAIN.WORKSPACE_DETAILS}`,
        component: WorkspaceDetailsComponent,
      }
    ]
  }
];

export default mainRoutes;