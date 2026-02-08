import { inject, Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { PollCandidatesController } from "@controllers/poll-candidates.controller";
import { Pagination } from "@models/common/common.type";
import { GetPollCandidate, GetPollCandidatePagination, PatchPollCandidate, PostPollCandidate } from "@models/polls/poll-candidate.type";

@Injectable({
  providedIn: 'root',
})
export class PollCandidatesService {
  private readonly pollCandidatesController = inject(PollCandidatesController);
  private readonly snackbar = inject(MatSnackBar);

  public async getPollCandidates(pollId: string, pagination: Pagination): Promise<GetPollCandidatePagination> {
    return this.pollCandidatesController.getPollCandidates(pollId, pagination).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to get poll candidates", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }

  public async createPollCandidate(pollId: string, payload: PostPollCandidate): Promise<GetPollCandidate> {
    return this.pollCandidatesController.createPollCandidate(pollId, payload).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to create poll candidate", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }

  public async updatePollCandidate(pollCandidateId: string, payload: PatchPollCandidate): Promise<GetPollCandidate> {
    return this.pollCandidatesController.updatePollCandidate(pollCandidateId, payload).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to update poll candidate", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }

  public async deletePollCandidate(pollCandidateId: string): Promise<void> {
    return this.pollCandidatesController.deletePollCandidate(pollCandidateId).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to delete poll candidate", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }
}