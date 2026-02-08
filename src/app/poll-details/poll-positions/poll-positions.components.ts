import { Component, inject, computed, OnInit } from "@angular/core";
import { PollPositionsStore } from "@store/poll-details/poll-positions.store";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { PollPositionCardComponent } from "./components/poll-position-card/poll-position-card.component";
import { PositionFormComponent } from "./components/position-form/position-form.component";
import { MatDialog } from "@angular/material/dialog";
import { PollDetailsStore } from "@store/poll-details/poll-details.store";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  selector: 'app-poll-positions',
  templateUrl: './poll-positions.component.html',
  styleUrls: ['./poll-positions.component.scss'],
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule, PollPositionCardComponent]
})
export class PollPositionsComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly pollDetailsStore = inject(PollDetailsStore);
  private readonly pollPositionsStore = inject(PollPositionsStore);

  public pollId = computed(() => this.pollDetailsStore.poll()?.id ?? '');

  public pollPositions = computed(() => this.pollPositionsStore.pollPositions());

  public sortedPollPositions = computed(() => this.pollPositionsStore.sortedPollPositions());

  public pagination = computed(() => this.pollPositionsStore.pagination());

  public loading = computed(() => this.pollPositionsStore.loading());

  public formLoading = computed(() => this.pollPositionsStore.formLoading());

  public updatingPollPosition = computed(() => this.pollPositionsStore.updatingPollPosition());

  public ngOnInit(): void {
    this.pollPositionsStore.getPollPositions(this.pollId());
  }

  public openCreatePositionDialog(): void {
    this.dialog.open(PositionFormComponent, {
      width: '100%',
      maxWidth: '600px',
      data: { mode: 'create' },
    });
  }
}