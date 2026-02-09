import { Component, computed, inject } from "@angular/core";
import { PollVotingsStore } from "@store/poll-details/poll-votings.store";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { PollVoteCardComponent } from "./components/poll-vote-card/poll-vote-card.component";

@Component({
  selector: 'app-poll-votings',
  templateUrl: './poll-votings.component.html',
  styleUrls: ['./poll-votings.component.scss'],
  imports: [
    MatButtonModule,
    MatIconModule,
    PollVoteCardComponent,
  ],
})
export class PollVotingsComponent {
  private readonly pollVotingsStore = inject(PollVotingsStore);

  public votingPositionResults = computed(() => this.pollVotingsStore.votingPositionResults());
  
  public isVotingPositionsResultEmpty = computed(() => this.votingPositionResults().length === 0);
}