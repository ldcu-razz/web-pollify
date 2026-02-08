import { inject, Injectable } from "@angular/core";
import { PollsController } from "@controllers/polls.controller";
import { GetPoll, GetPollsFilter, GetPollsPagination, PatchPoll, PostPoll } from "@models/polls/polls.type";
import { Pagination } from "@models/common/common.type";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root',
})
export class PollsService {
  private readonly pollsController = inject(PollsController);
  private readonly snackbar = inject(MatSnackBar);

  public async getPolls(pagination: Pagination, filters: GetPollsFilter): Promise<GetPollsPagination> {
    return this.pollsController.getPolls(pagination, filters).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to get polls", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }

  public async getPoll(pollId: string): Promise<GetPoll> {
    return this.pollsController.getPoll(pollId).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to get poll", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }

  public async createPoll(poll: PostPoll): Promise<GetPoll> {
    return this.pollsController.createPoll(poll).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to create poll", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }

  public async updatePoll(pollId: string, poll: PatchPoll): Promise<GetPoll> {
    return this.pollsController.updatePoll(pollId, poll).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to update poll", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }

  public async deletePoll(pollId: string): Promise<void> {
    return this.pollsController.deletePoll(pollId).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to delete poll", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }
}