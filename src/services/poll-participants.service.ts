import { PollParticipantsController } from "@controllers/poll-participants.controller";
import { inject, Injectable } from "@angular/core";
import { BulkPostPollParticipants, DeleteBulkPollParticipants, GetPollParticipant, GetPollParticipantFilters, GetPollParticipantsPagination, PatchPollParticipants } from "@models/polls/poll-participants.type";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Pagination } from "@models/common/common.type";
import { GetParticipant } from "@models/participants/participants.type";
import { ParticipantsController } from "@controllers/participants.controller";

@Injectable({
  providedIn: 'root',
})
export class PollParticipantsService {
  private readonly pollParticipantsController = inject(PollParticipantsController);
  private readonly participantsController = inject(ParticipantsController);
  private readonly snackbar = inject(MatSnackBar);

  public async getPollParticipants(pollId: string, pagination: Pagination, filters: GetPollParticipantFilters): Promise<GetPollParticipantsPagination> {
    return this.pollParticipantsController.getPollParticipants(pollId, pagination, filters).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to get poll participants", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }

  public async getPollParticipant(pollParticipantId: string): Promise<GetPollParticipant> {
    return this.pollParticipantsController.getPollParticipant(pollParticipantId).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to get poll participant", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }

  public async postPollParticipant(pollParticipant: GetPollParticipant): Promise<GetPollParticipant> {
    return this.pollParticipantsController.postPollParticipant(pollParticipant).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to post poll participant", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }

  public async bulkPostPollParticipants(pollParticipants: BulkPostPollParticipants): Promise<GetPollParticipant[]> {
    return this.pollParticipantsController.bulkPostPollParticipants(pollParticipants).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to bulk post poll participants", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }

  public async patchPollParticipant(pollParticipantId: string, pollParticipant: PatchPollParticipants): Promise<GetPollParticipant> {
    return this.pollParticipantsController.patchPollParticipant(pollParticipantId, pollParticipant).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to patch poll participant", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }

  public async deletePollParticipant(pollParticipantId: string): Promise<boolean> {
    return this.pollParticipantsController.deletePollParticipant(pollParticipantId).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to delete poll participant", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }

  public async deleteBulkPollParticipants(payload: DeleteBulkPollParticipants): Promise<boolean> {
    return this.pollParticipantsController.deleteBulkPollParticipants(payload).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to delete bulk poll participants", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }

  public async getGroupParticipants(groupId: string): Promise<GetParticipant[]> {
    return this.participantsController.getAllParticipants(groupId).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to get group participants", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }
}