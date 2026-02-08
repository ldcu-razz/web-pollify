import { Component, computed, inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { PollPositionsStore } from "@store/poll-details/poll-positions.store";

interface PollPositionDeleteConfirmationData {
  pollPositionId: string;
}

@Component({
  selector: 'app-poll-position-delete-confirmation',
  templateUrl: './poll-position-delete-confirmation.component.html',
  styleUrls: ['./poll-position-delete-confirmation.component.scss'],
  imports: [MatDialogModule, MatButtonModule, MatProgressSpinnerModule]
})
export class PollPositionDeleteConfirmationComponent {
  private readonly dialogRef = inject(MatDialogRef<PollPositionDeleteConfirmationComponent>);
  private readonly data = inject<PollPositionDeleteConfirmationData>(MAT_DIALOG_DATA);
  private readonly pollPositionsStore = inject(PollPositionsStore);

  public pollPositionId = computed(() => this.data.pollPositionId);

  public deletingPollPositionLoading = computed(() => this.pollPositionsStore.deletingPollPosition());

  public closeDialog(): void {
    this.dialogRef.close();
  }

  public async deletePollPosition(): Promise<void> {
    await this.pollPositionsStore.deletePollPosition(this.pollPositionId());
    this.closeDialog();
  }
}