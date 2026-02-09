import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { PollDetailsStore } from "@store/poll-details/poll-details.store";
import { PollParticipantsStore } from "@store/poll-details/poll-participants.store";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { PollParticipantsTableComponent } from "./components/poll-participants-table/poll-participants-table.component";
import { PollPartificipantsFormComponent } from "./components/poll-partificipants-form/poll-partificipants-form.component";
import { MatDialog } from "@angular/material/dialog";
import { PollImportParticipantsComponent } from "./components/poll-import-participants/poll-import-participants.component";

@Component({
  selector: 'app-poll-participants',
  templateUrl: './poll-participants.component.html',
  styleUrls: ['./poll-participants.component.scss'],
  imports: [MatCardModule, MatIconModule, MatMenuModule, MatButtonModule, MatFormFieldModule, MatInputModule, FormsModule, PollParticipantsTableComponent]
})
export class PollParticipantsComponent implements OnInit {
  private readonly pollDetailsStore = inject(PollDetailsStore);
  private readonly pollParticipantsStore = inject(PollParticipantsStore);
  private readonly dialog = inject(MatDialog);

  public isPollDraft = computed(() => this.pollDetailsStore.isPollDraft());

  public searchQuery = signal('');

  public pollId = computed(() => this.pollDetailsStore.poll()?.id ?? '');

  public ngOnInit(): void {
    this.pollParticipantsStore.getPollParticipants();
  }

  public searchPollParticipants(): void {
    this.pollParticipantsStore.searchPollParticipants(this.searchQuery());
  }

  public openCreateParticipantDialog(): void {
    this.dialog.open(PollPartificipantsFormComponent, {
      width: '100%',
      maxWidth: '600px',
      data: {
        mode: 'created',
      }
    });
  }

  public openImportParticipantsDialog(): void {
    this.dialog.open(PollImportParticipantsComponent, {
      width: '100%',
      maxWidth: '600px',
    });
  }
}