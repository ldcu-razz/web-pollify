import { Component, computed, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { PollParticipantsStore } from "@store/poll-details/poll-participants.store";

interface PollParticipantDeleteConfirmationData {
  participantId: string;
}

@Component({
  selector: 'app-poll-participant-delete-confirmation',
  templateUrl: './poll-participant-delete-confirmation.component.html',
  styleUrls: ['./poll-participant-delete-confirmation.component.scss'],
  imports: [MatDialogModule, MatButtonModule, MatProgressSpinnerModule, MatIconModule]
})
export class PollParticipantDeleteConfirmationComponent {
  private readonly dialogRef = inject(MatDialogRef<PollParticipantDeleteConfirmationComponent>);
  private readonly data = inject<PollParticipantDeleteConfirmationData>(MAT_DIALOG_DATA);
  private readonly pollParticipantsStore = inject(PollParticipantsStore);

  public participantId = computed(() => this.data.participantId);

  public deletingParticipantLoading = computed(() => this.pollParticipantsStore.deletingParticipant());

  public closeDialog(): void {
    this.dialogRef.close();
  }

  public async deleteParticipant(): Promise<void> {
    await this.pollParticipantsStore.deletePollParticipant(this.participantId());
    this.closeDialog();
  }
}