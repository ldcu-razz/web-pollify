import { Injectable, inject } from "@angular/core";
import { GroupsController } from "@controllers/groups.controller";
import { GetGroup, GetGroupsFilter, GetPaginatedGroups, PatchGroup, PostGroup } from "@models/groups/groups.type";
import { Pagination } from "@models/common/common.type";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root',
})
export class GroupsService {
  private readonly groupsController = inject(GroupsController);
  private readonly snackbar = inject(MatSnackBar)

  public async getGroups(pagination: Pagination, filters: GetGroupsFilter): Promise<GetPaginatedGroups> {
    return this.groupsController.getGroups(pagination, filters).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to get groups", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }

  public async getGroup(groupId: string): Promise<GetGroup> {
    return this.groupsController.getGroup(groupId).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to get group", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }

  public async createGroup(group: PostGroup): Promise<GetGroup> {
    return this.groupsController.createGroup(group).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to create group", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }

  public async updateGroup(groupId: string, group: PatchGroup): Promise<GetGroup> {
    return this.groupsController.updateGroup(groupId, group).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to update group", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }

  public async deleteGroup(groupId: string): Promise<boolean> {
    return this.groupsController.deleteGroup(groupId).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to delete group", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }
}