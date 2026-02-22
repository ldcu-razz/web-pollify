import { Component, computed, inject, signal } from "@angular/core";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { ROUTES as ROUTES_CONSTANTS } from "@constants/routes.constants";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { LogoutConfirmationDialogComponent } from "../logout-confirmation-dialog/logout-confirmation-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { AuthAdminStore } from "@store/auth/auth-admin.store";
import { AvatarComponent } from "@components/avatar/avatar.component";

@Component({
  selector: 'app-main-sidebar',
  templateUrl: './main-sidebar.component.html',
  styleUrls: ['./main-sidebar.component.scss'],
  imports: [MatListModule, MatIconModule, RouterLink, RouterLinkActive, AvatarComponent]
})
export class MainSidebarComponent {
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly authAdminStore = inject(AuthAdminStore);

  public readonly isAdmin = computed(() => this.authAdminStore.isAdmin());
  public readonly isSuperAdmin = computed(() => this.authAdminStore.isSuperAdmin());

  public readonly userName = computed(() => `${this.authAdminStore.session()?.first_name} ${this.authAdminStore.session()?.last_name}`);
  public readonly userAvatar = computed(() => this.authAdminStore.session()?.avatar ?? null);

  public readonly profilePath = computed(() => `${ROUTES_CONSTANTS.MAIN.PROFILE}`);

  public navigations = signal([
    {
      label: 'Home',
      icon: 'home',
      path: `${ROUTES_CONSTANTS.MAIN.HOME}`,
    },
    // Hide for now
    // ...(this.isSuperAdmin() ? [
    //   {
    //     label: 'Dashboard',
    //     icon: 'dashboard',
    //     path: `${ROUTES_CONSTANTS.MAIN.DASHBOARD}`,
    //   },
    // ] : []),
    {
      label: 'Polls',
      icon: 'poll',
      path: `${ROUTES_CONSTANTS.MAIN.POLLS}`,
    },
    {
      label: 'Groups',
      icon: 'groups_3',
      path: `${ROUTES_CONSTANTS.MAIN.GROUPS}`,
    },
    ...(this.isSuperAdmin() ? [
      {
        label: 'Users',
        icon: 'group',
        path: `${ROUTES_CONSTANTS.MAIN.USERS}`,
      },
    ] : []),
    ...(this.isSuperAdmin() ? [
      {
        label: 'Workspaces',
        icon: 'computer',
        path: `${ROUTES_CONSTANTS.MAIN.WORKSPACES}`,
      }
    ] : []),
  ])

  public navigateToProfile(): void {
    this.router.navigate([
      ROUTES_CONSTANTS.MAIN.BASE,
      ROUTES_CONSTANTS.MAIN.PROFILE,
    ]);
  }

  public openLogoutConfirmationDialog(): void {
    this.dialog.open(LogoutConfirmationDialogComponent, {
      width: '100%',
      maxWidth: '600px',
    });
  }
}