import { inject, Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Pagination } from "@models/common/common.type";
import { GetPaginatedUsersFilters, GetPaginatedUsers, PostUser, User, GetUser } from "@models/users/users.type";
import { UsersController } from "src/controllers/users.controller";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly usersController = inject(UsersController);
  private readonly snackbar = inject(MatSnackBar);

  public async getUsers(pagination: Pagination, filters: GetPaginatedUsersFilters): Promise<GetPaginatedUsers> {
    return this.usersController.getUsers(pagination, filters).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to get users", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }

  public async getUser(userId: string): Promise<GetUser> {
    return this.usersController.getUser(userId).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to get user", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }

  public async createUser(payload: PostUser): Promise<User> {
    return this.usersController.createUser(payload).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to create user", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }

  public async deleteUser(userId: string): Promise<boolean> {
    return this.usersController.deleteUser(userId).catch((error) => {
      console.error(error);
      this.snackbar.open("Failed to delete user", 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      throw error;
    });
  }
}