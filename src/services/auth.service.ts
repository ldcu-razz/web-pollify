import { inject, Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthController } from "@controllers/auth.controller";
import { AuthAccessToken } from "@models/auth/auth.type";
import { GetPollParticipant } from "@models/polls/poll-participants.type";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly authController = inject(AuthController);
  private readonly snackbar = inject(MatSnackBar);

  public async loginParticipants(rfidNumber: string, code: string): Promise<AuthAccessToken> {
    return this.authController.loginParticipants(rfidNumber, code).catch((error) => {
      this.snackbar.open(error.message, 'Close', {
        duration: 6000,
        panelClass: 'error-snackbar',
      });
      console.error(error);
      throw error;
    });
  }

  public async getPollParticipant(pollParticipantId: string): Promise<GetPollParticipant> {
    return this.authController.getPollParticipant(pollParticipantId).catch((error) => {
      console.error(error);
      this.snackbar.open(error.message, 'Close', {
        duration: 6000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }
}