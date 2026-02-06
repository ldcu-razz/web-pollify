import { Component, computed, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { UserStore } from "@store/users/users.store";
import { AvatarComponent } from "@components/avatar/avatar.component";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { ROUTES as ROUTES_CONSTANTS } from "@constants/routes.constants";
import { WorkspaceStore } from "@store/workspaces/workspace.store";
import { UserDetailsUpdateFormComponent } from "./components/user-details-update-form/user-details-update-form.component";
import { MatDialog } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { UserDeleteConfirmationComponent } from "../users/components/user-delete-confirmation/user-delete-confirmation.component";
import { TextTransformPipe } from "@pipes/text-transform.pipe";

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
  imports: [AvatarComponent, MatButtonModule, MatIconModule, MatListModule, MatProgressSpinnerModule, TextTransformPipe]
})
export class UserDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly userStore = inject(UserStore);
  private readonly workspaceStore = inject(WorkspaceStore);

  public currentUserLoading = computed(() => this.userStore.loading());

  public currentUser = computed(() => this.userStore.currentUser());

  public userName = computed(() => `${this.currentUser()?.first_name} ${this.currentUser()?.last_name}`);

  public userAvatar = computed(() => this.currentUser()?.avatar ?? null);

  public workspacesMap = computed(() => this.workspaceStore.workspacesMap());

  public userWorkspaces = computed(() => this.workspacesMap().get(this.currentUser()?.workspace_id ?? '')?.name ?? 'No workspace assigned');

  public ngOnInit(): void {
    const userId = this.route.snapshot.params['id'];
    if (userId) {
      this.userStore.getUser(userId);
    }
  }

  public openUpdateUserForm(fieldUpdateType: 'full_name' | 'email' | 'status' | 'role' | 'workspace_id' | 'password'): void {
    this.dialog.open(UserDetailsUpdateFormComponent, {
      width: '100%',
      maxWidth: '800px',
      data: {
        fieldUpdateType: fieldUpdateType,
      }
    });
  }

  public openDeleteUserConfirmationDialog(): void {
    const userId = this.currentUser()?.id ?? null;
    this.dialog.open(UserDeleteConfirmationComponent, {
      width: '100%',
      maxWidth: '600px',
      data: {
        userId,
      }
    }).afterClosed().subscribe(() => {
      this.navigateToUsers()
    });
  }

  public navigateToUsers(): void {
    this.router.navigate([
      ROUTES_CONSTANTS.MAIN.BASE,
      ROUTES_CONSTANTS.MAIN.USERS,
    ]);
  }
}