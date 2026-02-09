import { Component, computed, inject, OnInit } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { PollCandidateFormComponent } from "./components/poll-candidate-form/poll-candidate-form.component";
import { PollCandidatesStore } from "@store/poll-details/poll-candidates.store";
import { PollDetailsStore } from "@store/poll-details/poll-details.store";
import { PollCandidateTableComponent } from "./components/poll-candidate-table/poll-candidate-table.component";

@Component({
  selector: 'app-poll-candidates',
  templateUrl: './poll-candidates.component.html',
  styleUrls: ['./poll-candidates.component.scss'],
  imports: [MatCardModule, MatListModule, MatIconModule, MatMenuModule, MatButtonModule, PollCandidateTableComponent]
})
export class PollCandidatesComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly pollDetailsStore = inject(PollDetailsStore);
  private readonly pollCandidatesStore = inject(PollCandidatesStore);

  public pollId = computed(() => this.pollDetailsStore.poll()?.id ?? '');
  
  public isPollDraft = computed(() => this.pollDetailsStore.isPollDraft());

  public ngOnInit(): void {
    this.pollCandidatesStore.getPollCandidates(this.pollId());
  }

  public openCreateCandidateDialog(): void {
    this.dialog.open(PollCandidateFormComponent, {
      width: '100%',
      maxWidth: '620px',
      data: {
        mode: 'create',
        candidate: null,
      },
    });
  }
}