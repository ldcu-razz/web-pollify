import { Component, computed, inject, input } from "@angular/core"
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTooltipModule } from "@angular/material/tooltip";
import { GetPollPosition } from "@models/polls/poll-positions.type";
import { PollPositionDeleteConfirmationComponent } from "../poll-position-delete-confirmation/poll-position-delete-confirmation.component";
import { MatDialog } from "@angular/material/dialog";
import { PositionFormComponent } from "../position-form/position-form.component";

@Component({
  selector: 'app-poll-position-card',
  templateUrl: './poll-position-card.component.html',
  styleUrls: ['./poll-position-card.component.scss'],
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatMenuModule, MatProgressSpinnerModule, MatTooltipModule]
})
export class PollPositionCardComponent {
  private readonly dialog = inject(MatDialog);
  
  public pollPosition = input.required<GetPollPosition>();

  public pollPositionCandidates = computed(() => this.pollPosition()?.poll_candidates ?? []);

  public totalPollPositionCandidates = computed(() => this.pollPositionCandidates().length);

  public openUpdatePositionDialog(): void {
    this.dialog.open(PositionFormComponent, {
      width: '100%',
      maxWidth: '620px',
      data: {
        mode: 'update',
        position: this.pollPosition(),
      },
    });
  }

  public openDeleteConfirmationDialog(): void {
    this.dialog.open(PollPositionDeleteConfirmationComponent, {
      data: {
        pollPositionId: this.pollPosition().id,
      },
    });
  } 
}