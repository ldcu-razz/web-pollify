import { Component, signal } from "@angular/core";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { ROUTES as ROUTES_CONSTANTS } from "@constants/routes.constants";
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-main-sidebar',
  templateUrl: './main-sidebar.component.html',
  styleUrls: ['./main-sidebar.component.scss'],
  imports: [MatListModule, MatIconModule, RouterLink, RouterLinkActive]
})
export class MainSidebarComponent {

  public navigations = signal([
    {
      label: 'Dashboard',
      icon: 'home',
      path: '/home',
    },
    {
      label: 'Polls',
      icon: 'poll',
      path: '/polls',
    },
    {
      label: 'Users',
      icon: 'group',
      path: `${ROUTES_CONSTANTS.MAIN.USERS}`,
    },
    {
      label: 'Workspaces',
      icon: 'computer',
      path: `${ROUTES_CONSTANTS.MAIN.WORKSPACES}`,
    }
  ])
}