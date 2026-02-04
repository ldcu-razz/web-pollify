import { Routes } from "@angular/router";
import { MainComponent } from "./main.component";
import { WorkspacesComponent } from "../workspaces/workspaces.component";
import { ROUTES as ROUTES_CONSTANTS } from "@constants/routes.constants";
import { WorkspaceDetailsComponent } from "../workspace-details/workspace-details.component";

export const mainRoutes: Routes = [
  {
    path: ROUTES_CONSTANTS.MAIN.BASE,
    component: MainComponent,
    children: [
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