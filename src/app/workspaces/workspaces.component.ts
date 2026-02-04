import { Component, inject } from "@angular/core";
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

@Component({
  selector: 'app-workspaces',
  templateUrl: './workspaces.component.html',
  styleUrls: ['./workspaces.component.scss'],
  imports: [MatListModule, MatIconModule, MatButtonModule, MatInputModule, FormsModule, ReactiveFormsModule, WorkspaceCardComponent, MatDialogModule]
})
export class WorkspacesComponent {
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  
  public searchWorkspace = new FormControl('');


  public openDeleteWorkspaceDialog(): void {
    this.dialog.open(WorkspaceFormComponent, {
      width: '100%',
      maxWidth: '720px',
    });
  }
  public navigateToWorkspaceDetails(workspaceId: string): void {
    this.router.navigate([
      ROUTES_CONSTANTS.MAIN.BASE,
      ROUTES_CONSTANTS.MAIN.WORKSPACES,
      workspaceId,
    ]);
  }
}