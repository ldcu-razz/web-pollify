import { inject, Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { PollPositionsController } from "@controllers/poll-positions.controller";
import { Pagination } from "@models/common/common.type";
import { GetPollCandidate } from "@models/polls/poll-candidate.type";
import { GetPollPosition, GetPollPositionsPagination, PatchPollPosition, PostPollPosition } from "@models/polls/poll-positions.type";

@Injectable({
  providedIn: 'root',
})
export class PollPositionsService {
  private readonly pollPositionsController = inject(PollPositionsController);
  private readonly snackbar = inject(MatSnackBar);

  public async getPollPositions(pollId: string, pagination: Pagination): Promise<GetPollPositionsPagination> {
    return this.pollPositionsController.getPollPositions(pollId, pagination).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to get poll positions", 'Close');
      throw error;
    });
  }

  public async createPollPosition(pollPosition: PostPollPosition): Promise<GetPollPosition> {
    return this.pollPositionsController.createPollPosition(pollPosition).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to create poll position", 'Close');
      throw error;
    });
  }

  public async updatePollPosition(pollPositionId: string, pollPosition: PatchPollPosition): Promise<GetPollPosition> {
    return this.pollPositionsController.updatePollPosition(pollPositionId, pollPosition).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to update poll position", 'Close');
      throw error;
    });
  }

  public async deletePollPosition(pollPositionId: string): Promise<boolean> {
    return this.pollPositionsController.deletePollPosition(pollPositionId).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to delete poll position", 'Close');
      throw error;
    });
  }

  public async modifyPollPositionCandidates(pollPositionId: string, addedCandidateIds: string[], removedCandidateIds: string[]): Promise<GetPollCandidate[]> {
    return this.pollPositionsController.modifyPollPositionCandidates(pollPositionId, addedCandidateIds, removedCandidateIds).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to modify poll position candidates", 'Close');
      throw error;
    });
  }
}