import { MatCardModule } from "@angular/material/card";
import { Component, computed, input } from "@angular/core";
import { VotingPositionResult } from "@models/polls/poll-votings.type";
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { AvatarComponent } from "@components/avatar/avatar.component";

@Component({
  selector: 'app-poll-vote-card',
  templateUrl: './poll-vote-card.component.html',
  styleUrls: ['./poll-vote-card.component.scss'],
  imports: [
    MatCardModule,
    MatProgressBarModule,
    AvatarComponent
  ],
})
export class PollVoteCardComponent {
  public pollVotingPositionResult = input.required<VotingPositionResult>();

  public position = computed(() => this.pollVotingPositionResult()?.position);
  public candidates = computed(() => this.pollVotingPositionResult()?.candidates);
  public votings = computed(() => this.pollVotingPositionResult()?.votings);
}