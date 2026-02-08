import { inject, Injectable } from "@angular/core";
import { PollDetailsController } from "@controllers/poll-details.controller";
import { GetPoll, PatchPoll } from "@models/polls/polls.type";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class PollDetailsService {
  private readonly pollDetailsController = inject(PollDetailsController);
  private readonly snackbar = inject(MatSnackBar);

  public async getPollDetails(pollId: string): Promise<GetPoll> {
    return this.pollDetailsController.getPollDetails(pollId).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to get poll details", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }

  public async updatePoll(pollId: string, poll: PatchPoll): Promise<GetPoll> {
    return this.pollDetailsController.updatePoll(pollId, poll).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to update poll", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }
}