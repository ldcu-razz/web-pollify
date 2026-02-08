import { Component, computed, inject } from "@angular/core";  
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatButtonModule } from "@angular/material/button";
import { PollStore } from "@store/polls/polls.store";

interface PollDeleteConfirmationDialogData {
  pollId: string;
}

@Component({
  selector: 'app-poll-delete-confirmation',
  templateUrl: './poll-delete-confirmation.component.html',
  styleUrls: ['./poll-delete-confirmation.component.scss'],
  imports: [MatDialogModule, MatButtonModule, MatProgressSpinnerModule],
})
export class PollDeleteConfirmationComponent {
  private readonly dialogRef = inject(MatDialogRef<PollDeleteConfirmationComponent>);
  private readonly data = inject<PollDeleteConfirmationDialogData>(MAT_DIALOG_DATA);
  private readonly pollsStore = inject(PollStore);

  public pollId = computed(() => this.data.pollId);

  public deletingPollLoading = computed(() => this.pollsStore.deletingPollLoading());

  public closeDialog(): void {
    this.dialogRef.close();
  }

  public async deletePoll(): Promise<void> {
    await this.pollsStore.deletePoll(this.pollId());
    this.closeDialog();
  }
}