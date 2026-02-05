import { Component, computed, inject } from "@angular/core";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { WorkspaceStore } from "@store/workspaces/workspace.store";
import { Router } from "@angular/router";
import { ROUTES as ROUTES_CONSTANTS } from "@constants/routes.constants";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  selector: 'app-workspace-delete-confirm',
  templateUrl: './workspace-delete-confirm.component.html',
  styleUrls: ['./workspace-delete-confirm.component.scss'],
  imports: [MatDialogModule, MatButtonModule, MatProgressSpinnerModule]
})
export class WorkspaceDeleteConfirmComponent {
  private readonly dialogRef = inject(MatDialogRef<WorkspaceDeleteConfirmComponent>);
  private readonly router = inject(Router);
  private readonly workspaceStore = inject(WorkspaceStore);

  public currentWorkspace = computed(() => this.workspaceStore.currentWorkspace());

  public deletingWorkspaceLoading = computed(() => this.workspaceStore.deletingWorkspaceLoading());
  
  public closeDialog(): void {
    this.dialogRef.close();
  }

  public async deleteWorkspace(): Promise<void> {
    const currentWorkspaceId = this.currentWorkspace()?.id ?? null;
    if (currentWorkspaceId) {
      await this.workspaceStore.deleteWorkspace(currentWorkspaceId);
    }

    this.closeDialog();
    this.router.navigate([
      ROUTES_CONSTANTS.MAIN.BASE,
      ROUTES_CONSTANTS.MAIN.WORKSPACES,
    ]);
  }
}