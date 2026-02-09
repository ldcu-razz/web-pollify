import { Component, computed, inject } from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { DatePipe } from "@angular/common";
import { PollParticipantsStore } from "@store/poll-details/poll-participants.store";
import { TextTransformPipe } from "@pipes/text-transform.pipe";
import { PollParticipantDeleteConfirmationComponent } from "../poll-participant-delete-confirmation/poll-participant-delete-confirmation.component";
import { MatDialog } from "@angular/material/dialog";
import { PollPartificipantsFormComponent } from "../poll-partificipants-form/poll-partificipants-form.component";
import { PollParticipantStatusSchema } from "@models/polls/poll-participants.schema";


@Component({
  selector: 'app-poll-participants-table',
  templateUrl: './poll-participants-table.component.html',
  styleUrls: ['./poll-participants-table.component.scss'],
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatIconModule,
    MatChipsModule,
    MatButtonModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    DatePipe,
    TextTransformPipe,
  ]
})
export class PollParticipantsTableComponent {
  private readonly pollParticipantsStore = inject(PollParticipantsStore);
  private readonly dialog = inject(MatDialog);

  public participants = computed(() => this.pollParticipantsStore.pollParticipants());

  public pagination = computed(() => this.pollParticipantsStore.pagination());

  public loading = computed(() => this.pollParticipantsStore.loading());

  public searchLoading = computed(() => this.pollParticipantsStore.searchLoading());

  public loadMoreLoading = computed(() => this.pollParticipantsStore.loadMoreLoading());

  public displayedColumns = ['rfid_number', 'name', 'department', 'poll_status', 'updated_at', 'actions'];

  public pollParticipantStatus = PollParticipantStatusSchema.enum;

  public searchPollParticipants(query: string): void {
    this.pollParticipantsStore.searchPollParticipants(query);
  }

  public openDeleteParticipantConfirmationDialog(participantId: string): void {
    this.dialog.open(PollParticipantDeleteConfirmationComponent, {
      width: '100%',
      maxWidth: '600px',
      data: {
        participantId: participantId,
      }
    });
  }

  public openEditParticipantDialog(participantId: string): void {
    const participant = this.participants().find(participant => participant.id === participantId);
    if (!participant) {
      return;
    }

    this.dialog.open(PollPartificipantsFormComponent, {
      width: '100%',
      maxWidth: '600px',
      data: {
        mode: 'update',
        participant: participant,
      }
    });
  }
}