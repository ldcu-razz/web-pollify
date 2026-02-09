import { Component, computed, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { PollDetailsStore } from "@store/poll-details/poll-details.store";

interface PollCloseConfirmationDialogData {
  pollId: string;
}

@Component({
  selector: 'app-poll-close-confirmation',
  templateUrl: './poll-close-confirmation.component.html',
  styleUrls: ['./poll-close-confirmation.component.scss'],
  imports: [MatDialogModule, MatButtonModule, MatProgressSpinnerModule]
})
export class PollCloseConfirmationComponent {
  private readonly dialogRef = inject(MatDialogRef<PollCloseConfirmationComponent>);
  private readonly data = inject<PollCloseConfirmationDialogData>(MAT_DIALOG_DATA);
  private readonly pollDetailsStore = inject(PollDetailsStore);

  public pollId = computed(() => this.data.pollId);

  public closingPollLoading = computed(() => this.pollDetailsStore.updatingPoll());

  public closePoll() {
    this.pollDetailsStore.closePoll(this.pollId());
    this.closeDialog();
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }
} 