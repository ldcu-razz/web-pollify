import { inject, Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { PollVotingsController } from "@controllers/poll-votings.controller";
import { Pagination } from "@models/common/common.type";
import { BulkPostPollVoting, GetPollVoting, GetPollVotingsPaginated, PostPollVoting } from "@models/polls/poll-votings.type";

@Injectable({
  providedIn: 'root',
})
export class PollVotingsService {
  private readonly pollVotingsController = inject(PollVotingsController);
  private readonly snackbar = inject(MatSnackBar);

  public async getPollVotings(pollId: string, pagination: Pagination): Promise<GetPollVotingsPaginated> {
    return this.pollVotingsController.getPollVotings(pollId, pagination).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to get poll votings", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }

  public async getPollVoting(id: string): Promise<GetPollVoting> {
    return this.pollVotingsController.getPollVoting(id).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to get poll voting", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }

  public async createPollVoting(pollVoting: PostPollVoting): Promise<GetPollVoting> {
    return this.pollVotingsController.createPollVoting(pollVoting).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to create poll voting", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }

  public async bulkCreatePollVotings(pollVotings: BulkPostPollVoting): Promise<GetPollVoting[]> {
    return this.pollVotingsController.bulkCreatePollVotings(pollVotings).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to bulk create poll votings", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }
}