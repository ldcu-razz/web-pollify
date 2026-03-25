import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AvatarComponent } from '@components/avatar/avatar.component';
import { PollCandidate } from '@models/polls/poll-candidate.type';

interface CandidateInfoDialogData {
  candidate: PollCandidate;
}

@Component({
  selector: 'app-candidate-info-dialog',
  templateUrl: './candidate-info-dialog.component.html',
  styleUrls: ['./candidate-info-dialog.component.scss'],
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  standalone: true
})
export class CandidateInfoDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<CandidateInfoDialogComponent>);
  public readonly data = inject<CandidateInfoDialogData>(MAT_DIALOG_DATA);

  close(): void {
    this.dialogRef.close();
  }
}
