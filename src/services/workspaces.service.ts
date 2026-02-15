import { inject, Injectable } from "@angular/core";
import { GetPaginatedWorkspaces, GetPaginatedWorkspacesFilters, GetWorkspace, PostWorkspace, PutWorkspace } from "@models/workspace/workspace.type";
import { WorkspacesController } from "src/controllers/workspaces.controller";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Pagination } from "@models/common/common.type";
import { GetPoll } from "@models/polls/polls.type";
import { GetUser } from "@models/users/users.type";

@Injectable({
  providedIn: 'root'
})
export class WorkspacesService {
  private readonly workspacesController = inject(WorkspacesController);
  private readonly snackbar = inject(MatSnackBar);

  public async getWorkspaces(pagination: Pagination, filters: GetPaginatedWorkspacesFilters): Promise<GetPaginatedWorkspaces> {
    return this.workspacesController.getWorkspaces(pagination, filters).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to get workspaces", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }

  public async createWorkspace(workspace: PostWorkspace): Promise<GetWorkspace> {
    return this.workspacesController.createWorkspace(workspace).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to create workspace", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }

  public async getWorkspace(workspaceId: string): Promise<GetWorkspace> {
    return this.workspacesController.getWorkspace(workspaceId).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to get workspace", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }

  public async updateWorkspace(workspaceId: string, workspace: PutWorkspace): Promise<GetWorkspace> {
    return this.workspacesController.updateWorkspace(workspaceId, workspace).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to update workspace", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }

  public async deleteWorkspace(workspaceId: string): Promise<boolean> {
    return this.workspacesController.deleteWorkspace(workspaceId).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to delete workspace", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }

  public async getWorkspaceUsers(workspaceId: string): Promise<GetUser[]> {
    return this.workspacesController.getWorkspaceUsers(workspaceId).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to get workspace users", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }

  public async getWorkspacePolls(workspaceId: string): Promise<GetPoll[]> {
    return this.workspacesController.getWorkspacePolls(workspaceId).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to get workspace polls", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }

  public async removeWorkspaceUser(workspaceId: string, userId: string): Promise<boolean> {
    return this.workspacesController.removeWorkspaceUser(workspaceId, userId).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to remove user from workspace", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }
}