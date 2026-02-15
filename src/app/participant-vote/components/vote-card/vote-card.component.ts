import { CommonModule } from "@angular/common";
import { Component, computed, model } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatListModule } from "@angular/material/list";
import { AvatarComponent } from "@components/avatar/avatar.component";
import { PollPositionWithCandidate } from "@models/participants/participant-vote.type";
import { PollCandidate } from "@models/polls/poll-candidate.type";

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
}