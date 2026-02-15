import { Injectable, inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ParticipantVoteController } from "@controllers/participant-vote.controller";
import { GetParticipantVote } from "@models/participants/participant-vote.type";
import { BulkPostPollVoting, GetPollVoting } from "@models/polls/poll-votings.type";

@Injectable({
  providedIn: 'root',
})
export class ParticipantVoteService {
  private readonly participantVoteController = inject(ParticipantVoteController);
  private readonly snackbar = inject(MatSnackBar);

  public async getParticipantVote(pollId: string): Promise<GetParticipantVote> {
    return this.participantVoteController.getParticipantVote(pollId).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to get participant vote", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }

  public async createParticipantVote(participantId: string, payload: BulkPostPollVoting): Promise<GetPollVoting[]> {
    return this.participantVoteController.createParticipantVote(participantId, payload).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to create participant vote", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }

  public async getParticipantVotings(participantId: string): Promise<GetPollVoting[]> {
    return this.participantVoteController.getParticipantVotings(participantId).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to get participant votings", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }
}