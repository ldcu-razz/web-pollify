import { Component, inject } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { WorkspaceUsersComponent } from "./components/workspace-users/workspace-users.component";
import { WorkspacePollsComponent } from "./components/workspace-polls/workspace-polls.component";
import { Router } from "@angular/router";
import { ROUTES as ROUTES_CONSTANTS } from "@constants/routes.constants";
import { WorkspaceDeleteConfirmComponent } from "./components/workspace-delete-confirm/workspace-delete-confirm.component";
import { MatDialog } from "@angular/material/dialog";
import { WorkspaceAddUserComponent } from "./components/workspace-add-user/workspace-add-user.component";

@Component({
  selector: 'app-workspace-details',
  templateUrl: './workspace-details.component.html',
  styleUrls: ['./workspace-details.component.scss'],
  imports: [MatCardModule, MatButtonModule, MatIconModule, WorkspaceUsersComponent, WorkspacePollsComponent]
})
export class WorkspaceDetailsComponent {
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

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

  public navigateToWorkspaces(): void {
    this.router.navigate([
      ROUTES_CONSTANTS.MAIN.BASE,
      ROUTES_CONSTANTS.MAIN.WORKSPACES,
    ]);
  }
}