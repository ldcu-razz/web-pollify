import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Router } from "@angular/router";
import { ROUTES as ROUTES_CONSTANTS } from "@constants/routes.constants";
import { AuthAdminStore } from "@store/auth/auth-admin.store";

@Component({
  selector: 'app-logout-confirmation-dialog',
  templateUrl: './logout-confirmation-dialog.component.html',
  styleUrls: ['./logout-confirmation-dialog.component.scss'],
  imports: [MatDialogModule, MatButtonModule, MatProgressSpinnerModule]
})
export class LogoutConfirmationDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<LogoutConfirmationDialogComponent>);
  private readonly router = inject(Router);
  private readonly authAdminStore = inject(AuthAdminStore);
  
  public closeDialog(): void {
    this.dialogRef.close();
  }

  public async logout(): Promise<void> {
    this.authAdminStore.logout();
    await this.router.navigate([ROUTES_CONSTANTS.AUTH.LOGIN]);
    this.dialogRef.close();
  }
}