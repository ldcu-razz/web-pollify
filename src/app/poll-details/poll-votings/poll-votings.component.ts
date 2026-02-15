import { Component, computed, inject, OnInit } from "@angular/core";
import { PollVotingsStore } from "@store/poll-details/poll-votings.store";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { PollVoteCardComponent } from "./components/poll-vote-card/poll-vote-card.component";
import { PollDetailsStore } from "@store/poll-details/poll-details.store";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  selector: 'app-poll-votings',
  templateUrl: './poll-votings.component.html',
  styleUrls: ['./poll-votings.component.scss'],
  imports: [
    MatButtonModule,
    MatIconModule,
    PollVoteCardComponent,
    MatProgressSpinnerModule,
  ],
})
export class PollVotingsComponent implements OnInit {
  private readonly pollDetailsStore = inject(PollDetailsStore);
  private readonly pollVotingsStore = inject(PollVotingsStore);

  public pollId = computed(() => this.pollDetailsStore.poll()?.id ?? '');

  public totalVotings = computed(() => this.pollVotingsStore.totalVotings());

  public votingPositionResults = computed(() => this.pollVotingsStore.votingPositionResults());
  
  public isVotingPositionsResultEmpty = computed(() => this.votingPositionResults().length === 0);

  public loading = computed(() => this.pollVotingsStore.loading());

  public ngOnInit(): void {
    this.pollVotingsStore.getPollVotings(this.pollId());
  }

  public downloadTallyCsv(): void {
    this.pollVotingsStore.downloadTallyCsv();
  }
}