import { inject, Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { PollVotingsController } from "@controllers/poll-votings.controller";
import { Pagination } from "@models/common/common.type";
import { BulkPostPollVoting, GetPollVoting, GetPollVotingsPaginated, PostPollVoting, VotingPositionResult } from "@models/polls/poll-votings.type";

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

  public async dowmloadTallyCsv(filename: string, votingPositionResults: VotingPositionResult[]): Promise<void> {
    const escapeCsvValue = (value: string) =>
      value.includes(',') || value.includes('"') || value.includes('\n') ? `"${value.replace(/"/g, '""')}"` : value;

    const rows: { participant_rfid: string; position: string; candidate: string; voted_at: string }[] = [];
    for (const result of votingPositionResults) {
      for (const voting of result.votings) {
        const pollParticipant = voting.poll_participant;
        const pollCandidate = voting.poll_candidate;
        rows.push({
          participant_rfid: pollParticipant?.rfid_number ?? voting.poll_participant_id,
          position: result.position.name,
          candidate: pollCandidate?.name ?? '',
          voted_at: new Date(voting.created_at).toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          }),
        });
      }
    }

    const header = 'participant_rfid,position,candidate,voted_at';
    const csvString = [header, ...rows.map((row) => [row.participant_rfid, row.position, row.candidate, row.voted_at].map(escapeCsvValue).join(','))].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
}