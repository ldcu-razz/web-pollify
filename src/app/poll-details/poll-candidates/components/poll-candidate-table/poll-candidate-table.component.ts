import { Component, computed, inject } from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { PollCandidatesStore } from "@store/poll-details/poll-candidates.store";
import { DatePipe } from "@angular/common";
import { PollCandidateDeleteConfirmationComponent } from "../poll-candidate-delete-confirmation/poll-candidate-delete-confirmation.component";
import { MatDialog } from "@angular/material/dialog";
import { PollCandidateFormComponent } from "../poll-candidate-form/poll-candidate-form.component";

@Component({
  selector: 'app-poll-candidate-table',
  templateUrl: './poll-candidate-table.component.html',
  styleUrls: ['./poll-candidate-table.component.scss'],
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, DatePipe, MatIconModule, MatButtonModule, MatMenuModule, MatProgressSpinnerModule]
})
export class PollCandidateTableComponent {
  private readonly pollCandidatesStore = inject(PollCandidatesStore);
  private readonly dialog = inject(MatDialog);

  public candidates = computed(() => this.pollCandidatesStore.candidates());

  public pagination = computed(() => this.pollCandidatesStore.pagination());

  public loading = computed(() => this.pollCandidatesStore.loading());

  public displayedColumns = ['avatar', 'name', 'description', 'position', 'updated_at', 'actions'];

  public openEditCandidateDialog(candidateId: string): void {
    const candidate = this.candidates().find(candidate => candidate.id === candidateId);
    if (!candidate) {
      return;
    }

    this.dialog.open(PollCandidateFormComponent, {
      width: '100%',
      maxWidth: '600px',
      data: {
        mode: 'update',
        candidate: candidate,
      }
    });
  }

  public openDeleteCandidateConfirmationDialog(candidateId: string): void {
    this.dialog.open(PollCandidateDeleteConfirmationComponent, {
      width: '100%',
      maxWidth: '600px',
      data: {
        candidateId: candidateId,
      }
    });
  }
}