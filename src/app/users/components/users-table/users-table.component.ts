import { Component, computed, inject } from "@angular/core";
import { UserStore } from "@store/users/users.store";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatMenuModule } from "@angular/material/menu";
import { WorkspaceStore } from "@store/workspaces/workspace.store";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatDialog } from "@angular/material/dialog";
import { UserDeleteConfirmationComponent } from "../user-delete-confirmation/user-delete-confirmation.component";
import { Router } from "@angular/router";
import { ROUTES as ROUTES_CONSTANTS } from "@constants/routes.constants";
import { MatChipsModule } from "@angular/material/chips";
import { TextTransformPipe } from "@pipes/text-transform.pipe";

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
    MatChipsModule,
    TextTransformPipe
  ],
})
export class UsersTableComponent {
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
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
    this.dialog.open(UserDeleteConfirmationComponent, {
      width: '100%',
      maxWidth: '600px',
      data: {
        userId: userId,
      }
    })
  }

  public navigateToUserDetails(userId: string): void {
    this.router.navigate([
      ROUTES_CONSTANTS.MAIN.BASE,
      ROUTES_CONSTANTS.MAIN.USERS,
      userId,
    ]);
  }

  public onPageChange(event: PageEvent): void {
    const pagination = {
      page: event.pageIndex + 1,
      limit: event.pageSize,
      total: this.pagination().total,
    }
    this.userStore.getUsers(pagination, {});
  }
}
