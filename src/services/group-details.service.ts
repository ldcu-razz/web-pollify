import { inject, Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ParticipantsController } from "@controllers/participants.controller";
import { Pagination } from "@models/common/common.type";
import { GetGroup, PatchGroup } from "@models/groups/groups.type";
import { BulkPostParticipants, GetParticipant, GetParticipantsFilter, GetParticipantsPagination, PatchParticipants, PostParticipants } from "@models/participants/participants.type";

@Injectable({
  providedIn: 'root'
})
export class GroupDetailsService {
  private readonly participantsController = inject(ParticipantsController);
  private readonly snackbar = inject(MatSnackBar);

  public async getGroupDetails(groupId: string): Promise<GetGroup> {
    return this.participantsController.getGroupDetails(groupId).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to get group details", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }

  public async updateGroupDetails(groupId: string, payload: PatchGroup): Promise<GetGroup> {
    return this.participantsController.updateGroupDetails(groupId, payload).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to update group details", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }

  public async getGroupParticipants(pagination: Pagination, filters: GetParticipantsFilter, groupId: string): Promise<GetParticipantsPagination> {
    return this.participantsController.getParticipants(pagination, filters, groupId).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to get group participants", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }

  public async getParticipant(participantId: string): Promise<GetParticipant> {
    return this.participantsController.getParticipant(participantId).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to get participant", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }

  public async createParticipant(payload: PostParticipants): Promise<GetParticipant> {
    return this.participantsController.createParticipant(payload).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to create participant", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }

  public async bulkCreateParticipants(payload: BulkPostParticipants, groupId: string): Promise<GetParticipant[]> {
    return this.participantsController.bulkCreateParticipants(payload, groupId).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to bulk create participants", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }

  public async updateParticipant(participantId: string, payload: PatchParticipants): Promise<GetParticipant> {
    return this.participantsController.updateParticipant(participantId, payload).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to update participant", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }

  public async deleteParticipant(participantId: string): Promise<boolean> {
    return this.participantsController.deleteParticipant(participantId).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to delete participant", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }

  public async deleteBulkParticipants(participantIds: string[]): Promise<boolean> {
    return this.participantsController.deleteBulkParticipants(participantIds).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to delete bulk participants", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }
}