import { LiveAnnouncer } from "@angular/cdk/a11y";
import { Component, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";

@Component({
  selector: 'app-workspace-add-user',
  templateUrl: './workspace-add-user.component.html',
  styleUrls: ['./workspace-add-user.component.scss'],
  imports: [MatButtonModule, MatInputModule, MatIconModule, MatChipsModule, MatListModule, MatCardModule, FormsModule]
})
export class WorkspaceAddUserComponent {
  private readonly dialogRef = inject(MatDialogRef<WorkspaceAddUserComponent>);
  public announcer = inject(LiveAnnouncer);

  public searchUserQuery = signal('');
  public keywords = signal<string[]>(["John Doe", "Jane Doe"]);

  public closeDialog(): void {
    this.dialogRef.close();
  }

  public selectUser() {
    console.log('selectUser');
  }
}