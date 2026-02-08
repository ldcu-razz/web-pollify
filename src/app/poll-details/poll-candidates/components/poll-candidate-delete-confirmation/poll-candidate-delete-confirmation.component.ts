import { Component, computed, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { PollCandidatesStore } from "@store/poll-details/poll-candidates.store";

interface PollCandidateDeleteConfirmationData {
  candidateId: string;
}

@Component({
  selector: 'app-poll-candidate-delete-confirmation',
  templateUrl: './poll-candidate-delete-confirmation.component.html',
  styleUrls: ['./poll-candidate-delete-confirmation.component.scss'],
  imports: [MatDialogModule, MatButtonModule, MatProgressSpinnerModule]
})
export class PollCandidateDeleteConfirmationComponent {
  private readonly dialogRef = inject(MatDialogRef<PollCandidateDeleteConfirmationComponent>);
  private readonly data = inject<PollCandidateDeleteConfirmationData>(MAT_DIALOG_DATA);
  private readonly pollCandidatesStore = inject(PollCandidatesStore);

  public candidateId = computed(() => this.data.candidateId);

  public deletingCandidateLoading = computed(() => this.pollCandidatesStore.deletingCandidate());

  public closeDialog(): void {
    this.dialogRef.close();
  }

  public async deleteCandidate(): Promise<void> {
    await this.pollCandidatesStore.deletePollCandidate(this.candidateId());
    this.closeDialog();
  }
}