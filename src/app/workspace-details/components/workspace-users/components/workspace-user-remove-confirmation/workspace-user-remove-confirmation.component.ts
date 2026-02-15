import { Component, computed, inject, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { WorkspaceStore } from "@store/workspaces/workspace.store";

interface WorkspaceUserRemoveConfirmationData {
  userId: string;
  workspaceId: string;
}

@Component({
  selector: 'app-workspace-user-remove-confirmation',
  templateUrl: './workspace-user-remove-confirmation.component.html',
  styleUrls: ['./workspace-user-remove-confirmation.component.scss'],
  imports: [MatDialogModule, MatButtonModule, MatProgressSpinnerModule]
})
export class WorkspaceUserRemoveConfirmationComponent {
  private readonly dialogRef = inject(MatDialogRef<WorkspaceUserRemoveConfirmationComponent>);
  private readonly data = inject<WorkspaceUserRemoveConfirmationData>(MAT_DIALOG_DATA);
  private readonly workspaceStore = inject(WorkspaceStore);

  public workspaceId = computed(() => this.data?.workspaceId ?? null);

  public userId = computed(() => this.data?.userId ?? null);

  public loading = signal<boolean>(false);

  public closeDialog(): void {
    this.dialogRef.close();
  }

  public async removeUser(): Promise<void> {
    this.loading.set(true);
    if (this.workspaceId() && this.userId()) {
      await this.workspaceStore.removeWorkspaceUser(this.workspaceId(), this.userId());
    }
    this.loading.set(false);
    this.dialogRef.close(true);
  }
}