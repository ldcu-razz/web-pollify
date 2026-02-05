import { Component, computed, inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { UserStore } from "@store/users/users.store";

interface UserDeleteConfirmationDialogData {
  userId: string;
}

@Component({
  selector: 'app-user-delete-confirmation',
  templateUrl: './user-delete-confirmation.component.html',
  styleUrls: ['./user-delete-confirmation.component.scss'],
  imports: [MatDialogModule, MatButtonModule, MatProgressSpinnerModule]
})
export class UserDeleteConfirmationComponent {

  private readonly dialogRef = inject(MatDialogRef<UserDeleteConfirmationComponent>);
  public dialogData = inject<UserDeleteConfirmationDialogData>(MAT_DIALOG_DATA, { optional: true });
  private readonly userStore = inject(UserStore);

  public userId = computed(() => this.dialogData?.userId ?? null);

  public deletingUserLoading = computed(() => this.userStore.deletingUserLoading());

  public closeDialog(): void {
    this.dialogRef.close();
  }

  public async deleteUser(): Promise<void> {
    if (this.userId()) {
      await this.userStore.deleteUser(this.userId()!);
    }

    this.closeDialog();
  }
}