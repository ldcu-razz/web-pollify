import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule } from "@angular/forms";
import { WorkspaceStore } from "@store/workspaces/workspace.store";
import { MatSelectModule } from "@angular/material/select";
import { PollFormComponent } from "./components/poll-form/poll-form.component";
import { MatDialog } from "@angular/material/dialog";
import { PollStore } from "@store/polls/polls.store";
import { PollsTableComponent } from "./components/polls-table/polls-table.component";

@Component({
  selector: 'app-polls',
  templateUrl: './polls.component.html',
  styleUrls: ['./polls.component.scss'],
  imports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    PollsTableComponent
  ]
})
export class PollsComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly workspaceStore = inject(WorkspaceStore); 
  private readonly pollsStore = inject(PollStore);
  
  public searchQuery = signal('');

  public workspace = signal<string>('');
  
  public workspaces = computed(() => this.workspaceStore.workspaces());

  public polls = computed(() => this.pollsStore.polls());

  public pagination = computed(() => this.pollsStore.pagination());

  public loading = computed(() => this.pollsStore.loading());

  public searchLoading = computed(() => this.pollsStore.searchLoading());

  public ngOnInit(): void {
    this.pollsStore.getPolls({
      page: this.pagination().page,
      limit: this.pagination().limit,
      total: this.pagination().total,
    }, {});
  }

  public searchPolls(): void {
    this.pollsStore.searchPolls(this.searchQuery());
  }

  public openPollForm(): void {
    this.dialog.open(PollFormComponent, {
      width: '100%',
      maxWidth: '600px',
      data: { mode: 'create' },
    });
  }
}