import { Component, computed, inject, OnDestroy, OnInit } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { WorkspaceUsersComponent } from "./components/workspace-users/workspace-users.component";
import { WorkspacePollsComponent } from "./components/workspace-polls/workspace-polls.component";
import { ActivatedRoute, Router } from "@angular/router";
import { ROUTES as ROUTES_CONSTANTS } from "@constants/routes.constants";
import { WorkspaceDeleteConfirmComponent } from "./components/workspace-delete-confirm/workspace-delete-confirm.component";
import { MatDialog } from "@angular/material/dialog";
import { WorkspaceAddUserComponent } from "./components/workspace-add-user/workspace-add-user.component";
import { WorkspaceFormComponent } from "../workspaces/components/workspace-form/workspace-form.component";
import { WorkspaceStore } from "@store/workspaces/workspace.store";
import { AvatarComponent } from "@components/avatar/avatar.component";

@Component({
  selector: 'app-workspace-details',
  templateUrl: './workspace-details.component.html',
  styleUrls: ['./workspace-details.component.scss'],
  imports: [MatCardModule, MatButtonModule, MatIconModule, WorkspaceUsersComponent, WorkspacePollsComponent, MatProgressSpinnerModule, AvatarComponent]
})
export class WorkspaceDetailsComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly workspaceStore = inject(WorkspaceStore);

  public currentWorkspaceLoading = computed(() => this.workspaceStore.currentWorkspaceLoading());

  public currentWorkspace = computed(() => this.workspaceStore.currentWorkspace());

  public ngOnInit(): void {
    const workspaceId = this.route.snapshot.params['id'];
    if (workspaceId) {
      this.workspaceStore.getWorkspace(workspaceId);
    }
  }

  public openDeleteConfirmDialog(): void {
    this.dialog.open(WorkspaceDeleteConfirmComponent, {
      maxWidth: '600px',
      width: '100%',
    });
  }

  public openAddUserDialog(): void {
    this.dialog.open(WorkspaceAddUserComponent, {
      maxWidth: '800px',
      width: '100%',
    })
  }

  public openEditWorkspaceDialog(): void {
    this.dialog.open(WorkspaceFormComponent, {
      maxWidth: '800px',
      width: '100%',
      data: {
        mode: "update",
      }
    })
  }

  public navigateToWorkspaces(): void {
    this.router.navigate([
      ROUTES_CONSTANTS.MAIN.BASE,
      ROUTES_CONSTANTS.MAIN.WORKSPACES,
    ]);
  }

  public ngOnDestroy(): void {
    this.workspaceStore.resetCurrentWorkspace();
  }
}