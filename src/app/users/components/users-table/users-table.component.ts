import { Component, computed, inject } from "@angular/core";
import { UserStore } from "@store/users/users.store";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatMenuModule } from "@angular/material/menu";
import { WorkspaceStore } from "@store/workspaces/workspace.store";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatDialog } from "@angular/material/dialog";
import { UserDeleteConfirmationComponent } from "../user-delete-confirmation/user-delete-confirmation.component";

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss'],
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
  ],
})
export class UsersTableComponent {
  private readonly dialog = inject(MatDialog);
  public userStore = inject(UserStore);
  public workspaceStore = inject(WorkspaceStore);

  public displayedColumns = ['name', 'email', 'status', 'role', 'workspace', 'actions'];
  public users = computed(() => this.userStore.users());
  public pagination = computed(() => this.userStore.pagination());
  public loading = computed(() => this.userStore.loading());
  public searchLoading = computed(() => this.userStore.searchLoading());
  public isEmptyUsers = computed(() => this.users().length === 0);

  public workspacesMap = computed(() => this.workspaceStore.workspacesMap());

  public openDeleteUserConfirmationDialog(userId: string): void {
    console.log(userId);
    this.dialog.open(UserDeleteConfirmationComponent, {
      width: '100%',
      maxWidth: '600px',
      data: {
        userId: userId,
      }
    })
  }
}
