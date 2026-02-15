import { Component, computed, inject } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { WorkspaceCardComponent } from "./components/workspace-card/workspace-card.component";
import { Router } from "@angular/router";
import { ROUTES as ROUTES_CONSTANTS } from "@constants/routes.constants";
import { WorkspaceFormComponent } from "./components/workspace-form/workspace-form.component";
import { WorkspaceStore } from "@store/workspaces/workspace.store";
import { MatProgressSpinner } from "@angular/material/progress-spinner";

@Component({
  selector: 'app-workspaces',
  templateUrl: './workspaces.component.html',
  styleUrls: ['./workspaces.component.scss'],
  imports: [MatListModule, MatIconModule, MatButtonModule, MatInputModule, FormsModule, ReactiveFormsModule, WorkspaceCardComponent, MatDialogModule, MatProgressSpinner],
})
export class WorkspacesComponent {
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly workspaceStore = inject(WorkspaceStore);

  public searchWorkspace = new FormControl('');
  
  public workspaces = computed(() => this.workspaceStore.workspaces());

  public workspaceLoading = computed(() => this.workspaceStore.loading());

  public workspacePagination = computed(() => this.workspaceStore.pagination());
  
  public searchLoading = computed(() => this.workspaceStore.searchLoading());
  
  public openDeleteWorkspaceDialog(): void {
    this.dialog.open(WorkspaceFormComponent, {
      width: '100%',
      maxWidth: '720px',
    });
  }

  public searchWorkspaces(): void {
    this.workspaceStore.searchWorkspaces(this.searchWorkspace.value ?? '');
  }

  public navigateToWorkspaceDetails(workspaceId: string): void {
    this.router.navigate([
      ROUTES_CONSTANTS.MAIN.BASE,
      ROUTES_CONSTANTS.MAIN.WORKSPACES,
      workspaceId,
    ]);
  }
}