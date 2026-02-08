import { Component, computed, inject } from "@angular/core";
import { PollStore } from "@store/polls/polls.store";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatChipsModule } from "@angular/material/chips";
import { TextTransformPipe } from "@pipes/text-transform.pipe";
import { WorkspaceStore } from "@store/workspaces/workspace.store";
import { Router } from "@angular/router";
import { ROUTES as ROUTES_CONSTANTS } from "@constants/routes.constants";
import { DatePipe } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
import { PollDeleteConfirmationComponent } from "../poll-delete-confirmation/poll-delete-confirmation.component";

@Component({
  selector: 'app-polls-table',
  templateUrl: './polls-table.component.html',
  styleUrls: ['./polls-table.component.scss'],
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    TextTransformPipe,
    DatePipe
  ]
})
export class PollsTableComponent {
  private readonly pollsStore = inject(PollStore);
  private readonly workspaceStore = inject(WorkspaceStore);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  public polls = computed(() => this.pollsStore.polls());

  public pagination = computed(() => this.pollsStore.pagination()); 
  
  public loading = computed(() => this.pollsStore.loading());

  public searchLoading = computed(() => this.pollsStore.searchLoading());

  public workspacesMap = computed(() => this.workspaceStore.workspacesMap());

  public displayedColumns = ['name', 'code', 'status', 'workspace', 'start_date', 'end_date', 'actions'];

  public isEmptyPolls = computed(() => this.polls().length === 0);

  public onPageChange(event: PageEvent): void {
    const pagination = {
      page: event.pageIndex + 1,
      limit: event.pageSize,
      total: this.pagination().total,
    }
    this.pollsStore.getPolls(pagination, {});
  }

  public navigateToPollDetails(pollId: string): void {
    this.router.navigate([
      ROUTES_CONSTANTS.MAIN.BASE,
      ROUTES_CONSTANTS.MAIN.POLLS,
      pollId,
    ]);
  }

  public openDeletePollConfirmationDialog(pollId: string): void {
    this.dialog.open(PollDeleteConfirmationComponent, {
      width: '100%',
      maxWidth: '600px',
      data: {
        pollId: pollId,
      }
    });
  }
}