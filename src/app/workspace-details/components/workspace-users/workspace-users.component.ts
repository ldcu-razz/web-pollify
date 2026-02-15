import { Component, inject, OnInit, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { WorkspaceStore } from "@store/workspaces/workspace.store";
import { GetUser } from "@models/users/users.type";
import { ActivatedRoute } from "@angular/router";
import { TextTransformPipe } from "@pipes/text-transform.pipe";
import { AvatarComponent } from "@components/avatar/avatar.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatDialog } from "@angular/material/dialog";
import { WorkspaceUserRemoveConfirmationComponent } from "./components/workspace-user-remove-confirmation/workspace-user-remove-confirmation.component";

@Component({
  selector: 'app-workspace-users',
  templateUrl: './workspace-users.component.html',
  styleUrls: ['./workspace-users.component.scss'],
  imports: [MatCardModule, MatListModule, MatIconModule, MatMenuModule, MatButtonModule, TextTransformPipe, AvatarComponent, MatProgressSpinnerModule]
})
export class WorkspaceUsersComponent implements OnInit {
  private readonly workspaceStore = inject(WorkspaceStore);
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);

  public users = signal<GetUser[]>([]);

  public loading = signal<boolean>(false);

  public async ngOnInit(): Promise<void> {
    this.loading.set(true);
    const workspaceId = this.route.snapshot.params['id'];
    if (workspaceId) {
      const result = await this.workspaceStore.getWorkspaceUsers(workspaceId);
      this.users.set(result);
    }
    this.loading.set(false);
  }

  public openRemoveUserConfirmationDialog(userId: string): void {
    const workspaceId = this.route.snapshot.params['id'];
    this.dialog.open(WorkspaceUserRemoveConfirmationComponent, {
      width: '100%',
      maxWidth: '600px',
      data: { userId, workspaceId },
    }).afterClosed().subscribe((result) => {
      if (result) {
        this.users.update(users => users.filter(user => user.id !== userId));
      }
    });
  }
}