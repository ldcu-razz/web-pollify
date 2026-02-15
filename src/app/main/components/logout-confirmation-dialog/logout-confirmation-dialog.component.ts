import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Router } from "@angular/router";
import { ROUTES as ROUTES_CONSTANTS } from "@constants/routes.constants";

@Component({
  selector: 'app-logout-confirmation-dialog',
  templateUrl: './logout-confirmation-dialog.component.html',
  styleUrls: ['./logout-confirmation-dialog.component.scss'],
  imports: [MatDialogModule, MatButtonModule, MatProgressSpinnerModule]
})
export class LogoutConfirmationDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<LogoutConfirmationDialogComponent>);
  private readonly router = inject(Router);

  public closeDialog(): void {
    this.dialogRef.close();
  }

  public logout(): void {
    this.router.navigate([ROUTES_CONSTANTS.AUTH.LOGIN]);
    this.dialogRef.close();
  }
}