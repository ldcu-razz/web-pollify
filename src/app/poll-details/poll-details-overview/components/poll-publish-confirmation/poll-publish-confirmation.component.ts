import { Component, computed, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { PollDetailsStore } from "@store/poll-details/poll-details.store";

interface PollPublishConfirmationDialogData {
  pollId: string;
}

@Component({
  selector: 'app-poll-publish-confirmation',
  templateUrl: './poll-publish-confirmation.component.html',
  styleUrls: ['./poll-publish-confirmation.component.scss'],
  imports: [MatDialogModule, MatButtonModule, MatProgressSpinnerModule]
})
export class PollPublishConfirmationComponent {
  private readonly dialogRef = inject(MatDialogRef<PollPublishConfirmationComponent>);
  private readonly data = inject<PollPublishConfirmationDialogData>(MAT_DIALOG_DATA);
  private readonly pollDetailsStore = inject(PollDetailsStore);

  public pollId = computed(() => this.data.pollId);

  public publishingPollLoading = computed(() => this.pollDetailsStore.updatingPoll());

  public closeDialog(): void {
    this.dialogRef.close();
  }

  public async publishPoll(): Promise<void> {
    await this.pollDetailsStore.publishPoll(this.pollId());
    this.closeDialog();
  }
} 