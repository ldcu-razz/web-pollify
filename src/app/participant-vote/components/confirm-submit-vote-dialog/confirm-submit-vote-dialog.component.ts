import { CommonModule } from "@angular/common";
import { Component, computed, inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { PollPositionWithCandidate } from "@models/participants/participant-vote.type";

export interface ConfirmSubmitVoteDialogData {
  pollPositionsWithCandidates: PollPositionWithCandidate[];
}

@Component({
  selector: 'app-confirm-submit-vote-dialog',
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './confirm-submit-vote-dialog.component.html',
  styleUrls: ['./confirm-submit-vote-dialog.component.scss'],
})
export class ConfirmSubmitVoteDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<ConfirmSubmitVoteDialogComponent, boolean>);
  public readonly data = inject<ConfirmSubmitVoteDialogData>(MAT_DIALOG_DATA);

  public readonly selectedVotesSummary = computed(() => {
    return this.data.pollPositionsWithCandidates.map((ppwc) => {
      const selectedCandidateId = ppwc.poll_selected.poll_candidate;
      const selectedCandidate = ppwc.candidates.find((c) => c.id === selectedCandidateId) ?? null;
      const positionName = ppwc.position.name;

      if (!selectedCandidate) {
        return {
          positionName,
          label: 'No selected candidate',
        };
      }

      const partylist = selectedCandidate.poll_partylist?.name ?? 'Unassigned';
      return {
        positionName,
        label: `${selectedCandidate.name} (${partylist})`,
      };
    });
  });

  public cancel(): void {
    this.dialogRef.close(false);
  }

  public confirm(): void {
    this.dialogRef.close(true);
  }
}

