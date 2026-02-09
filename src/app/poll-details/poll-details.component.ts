import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon"; 
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";
import { MatDialogModule } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatChipsModule } from "@angular/material/chips";
import { Component, computed, inject, OnDestroy, OnInit } from "@angular/core";
import { PollDetailsStore } from "@store/poll-details/poll-details.store";
import { PollDetailsNavbarComponent } from "./components/poll-details-navbar/poll-details-navbar.component";
import { ActivatedRoute, RouterOutlet } from "@angular/router";
import { PollPositionsStore } from "@store/poll-details/poll-positions.store";
import { PollCandidatesStore } from "@store/poll-details/poll-candidates.store";
import { PollParticipantsStore } from "@store/poll-details/poll-participants.store";

@Component({
  selector: 'app-poll-details',
  templateUrl: './poll-details.component.html',
  styleUrls: ['./poll-details.component.scss'],
  imports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatSelectModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    PollDetailsNavbarComponent,
    RouterOutlet,
  ],
})
export class PollDetailsComponent implements OnInit, OnDestroy {
  private readonly pollDetailsStore = inject(PollDetailsStore);
  private readonly pollPositionsStore = inject(PollPositionsStore);
  private readonly pollCandidatesStore = inject(PollCandidatesStore);
  private readonly pollParticipantsStore = inject(PollParticipantsStore);
  
  private readonly route = inject(ActivatedRoute);

  public pollId = computed(() => this.route.snapshot.params['id']);

  public loading = computed(() => this.pollDetailsStore.loading());

  public async ngOnInit(): Promise<void> {
    await this.pollDetailsStore.getPollDetails(this.pollId());
    await this.pollPositionsStore.getPollPositions(this.pollId());
    await this.pollCandidatesStore.getPollCandidates(this.pollId());
  }

  public ngOnDestroy(): void {
    this.pollDetailsStore.resetPollDetails();
    this.pollPositionsStore.resetPollPositions();
    this.pollCandidatesStore.resetPollCandidates();
    this.pollParticipantsStore.resetPollParticipants();
  }
}