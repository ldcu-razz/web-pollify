import { Component, computed, inject, signal } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { TextTransformPipe } from "@pipes/text-transform.pipe";
import { disabled, email, form, FormField, required, validate } from "@angular/forms/signals";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { UserStore } from "@store/users/users.store";
import { UserRolesSchema, UserStatusSchema } from "@models/users/users.schema";
import { MatSelectModule } from "@angular/material/select";
import { UserRoles, UserStatus } from "@models/users/users.type";
import bcrypt from "bcryptjs";
import { WorkspaceStore } from "@store/workspaces/workspace.store";

interface UserDetailsUpdateFormDialogData {
  userId: string;
  fieldUpdateType: 'full_name' | 'email' | 'status' | 'role' | 'workspace_id' | 'password';
}

@Component({
  selector: 'app-user-details-update-form',
  templateUrl: './user-details-update-form.component.html',
  styleUrls: ['./user-details-update-form.component.scss'],
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatSelectModule, TextTransformPipe, FormField]
})
export class UserDetailsUpdateFormComponent {
  private readonly dialogRef = inject(MatDialogRef<UserDetailsUpdateFormComponent>);
  private readonly dialogData = inject<UserDetailsUpdateFormDialogData>(MAT_DIALOG_DATA, { optional: true });
  private readonly userStore = inject(UserStore);
  private readonly workspaceStore = inject(WorkspaceStore);

  public titleMap = new Map<string, string>([
    ['full_name', 'Update First name and Last name'],
    ['email', 'Update Email'],
    ['status', 'Update Status'],
    ['role', 'Update Role'],
    ['workspace_id', 'Update Workspace'],
    ['password', 'Update Password'],
  ]);

  public title = computed(() => this.titleMap.get(this.fieldUpdateType() ?? '') ?? 'Update User');

  public fieldUpdateType = computed(() => this.dialogData?.fieldUpdateType ?? null);

  public loadingUpdateUser = computed(() => this.userStore.loadingUpdateUser());

  public currentUser = computed(() => this.userStore.currentUser());

  public userFirstAndLastName = signal({
    first_name: this.currentUser()?.first_name ?? '',
    last_name: this.currentUser()?.last_name ?? '',
  });

  public userFirstAndLastNameForm = form(this.userFirstAndLastName, (schemaPath) => {
    required(schemaPath.first_name, {message: "First name is required"});
    required(schemaPath.last_name, {message: "Last name is required"});
  });

  public userEmail = signal({
    email: this.currentUser()?.email ?? '',
  });

  public userEmailForm = form(this.userEmail, (schemaPath) => {
    required(schemaPath.email, {message: "Email is required"});
    email(schemaPath.email, {message: "Your email address is invalid"});
  });

  public hasEmailRequiredError = computed(() => this.userEmailForm.email().errors().some((error: { kind: string }) => error.kind === "required"));
  public hasEmailInvalidError = computed(() => this.userEmailForm.email().errors().some((error: { kind: string }) => error.kind === "email"));

  public userStatus = signal({
    status: this.currentUser()?.status ?? '',
  });

  public userStatusForm = form(this.userStatus, (schemaPath) => {
    required(schemaPath.status, {message: "Status is required"});
  });

  public statusOptions = signal(UserStatusSchema.options);

  public userRole = signal({
    role: this.currentUser()?.role ?? '',
  });

  public userRoleForm = form(this.userRole, (schemaPath) => {
    required(schemaPath.role, {message: "Role is required"});
  });

  public roleOptions = signal(UserRolesSchema.options);

  public userPassword = signal({
    newPassword: '',
    confirmNewPassword: '',
  });

  public userPasswordForm = form(this.userPassword, (schemaPath) => {
    required(schemaPath.newPassword, {message: "New password is required"});
    required(schemaPath.confirmNewPassword, {message: "Confirm new password is required"});
    validate(schemaPath.confirmNewPassword, (ctx) => {
      const value = ctx.value() as string;
      const newPasswordValue = this.userPasswordForm.newPassword().value();
      if (value && newPasswordValue && value !== newPasswordValue) {
        return { kind: "passwordMatch", message: "Passwords must match" };
      }
      return null;
    });
  });

  public isConfirmNewPasswordRequired = computed(() => this.userPasswordForm.confirmNewPassword().touched() && this.userPasswordForm.confirmNewPassword().errors().some((error: { kind: string }) => error.kind === "required"));
  public isPasswordsNotMatch = computed(() => this.userPasswordForm.confirmNewPassword().touched() && this.userPasswordForm.confirmNewPassword().errors().some((error: { kind: string }) => error.kind === "passwordMatch"));

  public userWorkspace = signal({
    workspace_id: this.currentUser()?.workspace_id ?? '',
  });
  
  public workspaceOptions = computed(() => this.workspaceStore.workspaces());

  public userWorkspaceForm = form(this.userWorkspace, (schemaPath) => {
    required(schemaPath.workspace_id, {message: "Workspace is required"});
    if (this.currentUser()?.workspace_id) {
      disabled(schemaPath.workspace_id);
    }
  });

  public closeDialog(): void {
    this.dialogRef.close();
  }

  public updateUser(): void {
    switch (this.fieldUpdateType()) {
      case 'full_name':
        this.updateUserFirstAndLastName();
        break;
      case 'email':
        this.updateUserEmail();
        break;
      case 'status':
        this.updateUserStatus();
        break;
      case 'role':
        this.updateUserRole();
        break;
      case 'password':
        this.updateUserPassword();
        break;
      case 'workspace_id':
        this.updateUserWorkspace();
        break;
    }
  }

  public async updateUserFirstAndLastName(): Promise<void> {
    if (this.userFirstAndLastNameForm().invalid()) {
      this.userFirstAndLastNameForm().markAsTouched()
      return;
    }

    await this.userStore.updateUser(this.currentUser()?.id ?? '', {
      first_name: this.userFirstAndLastNameForm().value().first_name,
      last_name: this.userFirstAndLastNameForm().value().last_name,
    });
    this.closeDialog();
  }

  public async updateUserEmail(): Promise<void> {
    if (this.userEmailForm().invalid()) {
      this.userEmailForm().markAsTouched()
      return;
    }

    await this.userStore.updateUser(this.currentUser()?.id ?? '', {
      email: this.userEmailForm().value().email,
    });
    this.closeDialog();
  }

  public async updateUserStatus(): Promise<void> {
    if (this.userStatusForm().invalid()) {
      this.userStatusForm().markAsTouched()
      return;
    }

    await this.userStore.updateUser(this.currentUser()?.id ?? '', {
      status: this.userStatusForm.status().value() as UserStatus,
    });
    this.closeDialog();
  }

  public async updateUserRole(): Promise<void> {  
    if (this.userRoleForm().invalid()) {
      this.userRoleForm().markAsTouched()
      return;
    }

    await this.userStore.updateUser(this.currentUser()?.id ?? '', {
      role: this.userRoleForm.role().value() as UserRoles,
    });
    this.closeDialog();
  }

  public async updateUserPassword(): Promise<void> {
    if (this.userPasswordForm().invalid()) {
      this.userPasswordForm().markAsTouched()
      return;
    }

    await this.userStore.updateUser(this.currentUser()?.id ?? '', {
      password: bcrypt.hashSync(this.userPasswordForm.newPassword().value(), 10),
    });
    this.closeDialog();
  }

  public async updateUserWorkspace(): Promise<void> {
    if (this.userWorkspaceForm().invalid()) {
      this.userWorkspaceForm().markAsTouched()
      return;
    }

    await this.userStore.updateUser(this.currentUser()?.id ?? '', {
      workspace_id: this.userWorkspaceForm.workspace_id().value() as string,
    });
    this.closeDialog();
  }
}