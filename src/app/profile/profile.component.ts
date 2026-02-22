import { Component, computed, inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthAdminStore } from "@store/auth/auth-admin.store";
import { WorkspaceStore } from "@store/workspaces/workspace.store";
import { AvatarComponent } from "@components/avatar/avatar.component";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatDialog } from "@angular/material/dialog";
import { TextTransformPipe } from "@pipes/text-transform.pipe";
import { UserDetailsUpdateFormComponent } from "../user-details/components/user-details-update-form/user-details-update-form.component";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [
    AvatarComponent,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TextTransformPipe,
  ],
})
export class ProfileComponent {
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly authAdminStore = inject(AuthAdminStore);
  private readonly workspaceStore = inject(WorkspaceStore);

  public session = this.authAdminStore.session;

  public userName = computed(() => {
    const s = this.authAdminStore.session();
    return s ? `${s.first_name} ${s.last_name}` : '';
  });

  public userAvatar = computed(() => this.authAdminStore.session()?.avatar ?? null);

  public workspacesMap = computed(() => this.workspaceStore.workspacesMap());

  public workspaceName = computed(
    () =>
      this.workspacesMap().get(this.authAdminStore.session()?.workspace_id ?? '')?.name ??
      'No workspace assigned'
  );

  public openChangePasswordDialog(): void {
    const userId = this.authAdminStore.session()?.id;
    if (!userId) return;
    this.dialog.open(UserDetailsUpdateFormComponent, {
      width: '100%',
      maxWidth: '800px',
      data: { userId, fieldUpdateType: 'password' as const },
    });
  }
}
