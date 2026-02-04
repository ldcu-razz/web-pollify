import { Component, inject } from "@angular/core";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: 'app-workspace-delete-confirm',
  templateUrl: './workspace-delete-confirm.component.html',
  styleUrls: ['./workspace-delete-confirm.component.scss'],
  imports: [MatDialogModule, MatButtonModule]
})
export class WorkspaceDeleteConfirmComponent {
  private readonly dialogRef = inject(MatDialogRef<WorkspaceDeleteConfirmComponent>);

  public closeDialog(): void {
    this.dialogRef.close();
  }
}