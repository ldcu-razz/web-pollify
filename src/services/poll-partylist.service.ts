import { inject, Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { PollPartylistController } from "@controllers/poll-partylist.controller";
import { GetPollPartylist, PatchPollPartylist, PostPollPartylist } from "@models/polls/poll-partylist.type";

@Injectable({
  providedIn: 'root',
})
export class PollPartylistService {
  private readonly pollPartylistController = inject(PollPartylistController);
  private readonly snackbar = inject(MatSnackBar);

  public async getPollPartylists(pollId: string): Promise<GetPollPartylist[]> {
    return this.pollPartylistController.getPollPartylists(pollId).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to get poll partylists", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }

  public async createPollPartylist(pollPartylist: PostPollPartylist): Promise<GetPollPartylist> {
    return this.pollPartylistController.createPollPartylist(pollPartylist).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to create poll partylist", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }

  public async updatePollPartylist(pollPartylistId: string, pollPartylist: PatchPollPartylist): Promise<GetPollPartylist> {
    return this.pollPartylistController.updatePollPartylist(pollPartylistId, pollPartylist).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to update poll partylist", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }

  public async deletePollPartylist(pollPartylistId: string): Promise<boolean> {
    return this.pollPartylistController.deletePollPartylist(pollPartylistId).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to delete poll partylist", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }
}