import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { AuthParticipantsStore } from "@store/auth/auth-participants.store";
import { ROUTES as ROUTES_CONSTANTS } from "@constants/routes.constants";

@Component({
  selector: 'app-participant-logout-confirmation',
  templateUrl: './participant-logout-confirmation.component.html',
  styleUrls: ['./participant-logout-confirmation.component.scss'],
  imports: [MatButtonModule]
})
export class ParticipantLogoutConfirmationComponent {
  private readonly dialogRef = inject(MatDialogRef<ParticipantLogoutConfirmationComponent>);
  private readonly authParticipantsStore = inject(AuthParticipantsStore);
  private readonly router = inject(Router);

  public closeDialog(): void {
    this.dialogRef.close();
  }

  public async logout(): Promise<void> {
    await this.authParticipantsStore.logout();
    this.dialogRef.close();
    this.router.navigate([ROUTES_CONSTANTS.AUTH.LOGIN]);
  }
}