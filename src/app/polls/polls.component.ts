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
import { AuthAdminStore } from "@store/auth/auth-admin.store";

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
  private readonly authAdminStore = inject(AuthAdminStore);

  public searchQuery = signal('');

  public workspace = signal<string>('');
  
  public workspaces = computed(() => this.workspaceStore.workspaces());

  public polls = computed(() => this.pollsStore.polls());

  public pagination = computed(() => this.pollsStore.pagination());

  public loading = computed(() => this.pollsStore.loading());

  public searchLoading = computed(() => this.pollsStore.searchLoading());

  public isSuperAdmin = computed(() => this.authAdminStore.isSuperAdmin());

  public workspaceId = computed(() => this.authAdminStore.workspaceId());

  public disabledWorkspaceSelectField = computed(() => !this.isSuperAdmin());

  public ngOnInit(): void {
    this.pollsStore.getPolls({
      page: this.pagination().page,
      limit: this.pagination().limit,
      total: this.pagination().total,
    }, {});

    if (!this.isSuperAdmin() && this.workspaceId()) {
      this.workspace.set(this.workspaceId() ?? '');
    }
  }

  public searchPolls(): void {
    this.pollsStore.searchPolls({ q: this.searchQuery(), workspace_id: this.workspace() ?? undefined });
  }

  public filterPolls(): void {
    if (!this.isSuperAdmin()) {
      return;
    }

    this.pollsStore.filterPoll({ q: this.searchQuery(), workspace_id: this.workspace() ?? undefined });
  }

  public clearWorkspace(): void {
    this.workspace.set('');
    this.pollsStore.filterPoll({ q: this.searchQuery(), workspace_id: this.workspace() });
  }

  public openPollForm(): void {
    this.dialog.open(PollFormComponent, {
      width: '100%',
      maxWidth: '600px',
      data: { mode: 'create' },
    });
  }
}