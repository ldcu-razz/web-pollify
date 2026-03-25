import { CommonModule } from "@angular/common";
import { Component, computed, inject, model } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatListModule } from "@angular/material/list";
import { MatDialog } from "@angular/material/dialog";
import { AvatarComponent } from "@components/avatar/avatar.component";
import { PollPositionWithCandidate } from "@models/participants/participant-vote.type";
import { PollCandidate } from "@models/polls/poll-candidate.type";
import { CandidateInfoDialogComponent } from "src/app/poll-details/poll-candidates/components/candidate-info-dialog/candidate-info-dialog.component";

@Component({
  selector: 'app-vote-card',
  templateUrl: './vote-card.component.html',
  styleUrls: ['./vote-card.component.scss'],
  imports: [CommonModule, MatCardModule, MatListModule, AvatarComponent, MatButtonModule]
})
export class VoteCardComponent {
  public pollPositionWithCandidate = model.required<PollPositionWithCandidate>();

  public position = computed(() => this.pollPositionWithCandidate()?.position);
  public candidates = computed(() => this.pollPositionWithCandidate()?.candidates);

  public onCandidateSelected(selected: boolean, candidate: PollCandidate): void {
    if (selected) {
      this.pollPositionWithCandidate.update(state => {
        return {
          ...state,
          poll_selected: {
            poll_position: this.position()?.id ?? '',
            poll_candidate: candidate.id,
          }
        }
      })
    } else {
      this.pollPositionWithCandidate.update(state => {
        return {
          ...state,
          poll_selected: {
            poll_position: this.position()?.id ?? '',
            poll_candidate: '',
          }
        }
      });
    }
  }

  private readonly dialog = inject(MatDialog);

  public openCandidateInfoDialog(candidate: PollCandidate): void {
    this.dialog.open(CandidateInfoDialogComponent, {
      width: '100%',
      maxWidth: '600px',
      data: { candidate }
    });
  }
}
