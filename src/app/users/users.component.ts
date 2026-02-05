import { Component, inject, model, OnInit, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UserRolesSchema } from "@models/users/users.schema";
import { TextTransformPipe } from "src/pipes/text-transform.pipe";
import { MatDialog } from "@angular/material/dialog";
import { UserFormComponent } from "./components/user-form/user-form.component";
import { UserStore } from "@store/users/users.store";
import { UsersTableComponent } from "./components/users-table/users-table.component";
import { UserRoles } from "@models/users/users.type";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  imports: [MatCardModule, MatListModule, MatIconModule, MatMenuModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, FormsModule, ReactiveFormsModule, TextTransformPipe, UsersTableComponent]
})
export class UsersComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly userStore = inject(UserStore);

  public searchUser = model<string>('');
  public filterRole = model<UserRoles | null>(null);

  public roleOptions = signal(UserRolesSchema.options);

  public ngOnInit(): void {
    this.userStore.getUsers(this.userStore.pagination(), {});
  }

  public searchUsers(): void {
    this.userStore.searchUsers(this.searchUser());
  }

  public filterUsers(): void {
    this.userStore.filterUsers({ role: this.filterRole() ?? undefined });
  }

  public openCreateUserDialog(): void {
    this.dialog.open(UserFormComponent, {
      width: '100%',
      maxWidth: '800px',
      data: {
        mode: "create",
      }
    })
  }
}