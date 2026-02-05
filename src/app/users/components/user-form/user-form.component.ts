import { Component, computed, inject, signal } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { email, form, FormField, required, validate } from "@angular/forms/signals";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSelectModule } from "@angular/material/select";
import { UserRolesSchema, UserStatusSchema } from "@models/users/users.schema";
import { TextTransformPipe } from "@pipes/text-transform.pipe";
import { UserStore } from "@store/users/users.store";
import { PostUser, UserRoles, UserStatus } from "@models/users/users.type";
import { WorkspaceStore } from "@store/workspaces/workspace.store";

interface UserFormDialogData {
  mode?: "create" | "update";
}

interface UserFormData {
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  password: string;
  confirmPassword: string;
  role: string;
  workspace_id: string;
}

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatSelectModule, MatProgressSpinnerModule, TextTransformPipe, FormField],
})
export class UserFormComponent {
  private readonly dialogRef = inject(MatDialogRef<UserFormComponent>);
  public dialogData = inject<UserFormDialogData>(MAT_DIALOG_DATA, { optional: true });
  public userStore = inject(UserStore);
  public workspaceStore = inject(WorkspaceStore);

  public mode = signal(this.dialogData?.mode ?? "create");
  public statusOptions = signal(UserStatusSchema.options);
  public roleOptions = signal(UserRolesSchema.options);
  public workspaceOptions = computed(() => this.workspaceStore.workspaces());

  public userFormData = signal<UserFormData>({
    first_name: "",
    last_name: "",
    email: "",
    status: this.statusOptions()[0],
    password: "",
    confirmPassword: "",
    role: this.roleOptions()[0],
    workspace_id: "",
  });

  public userForm = form(this.userFormData, (schemaPath) => {
    required(schemaPath.first_name, {message: "First name is required"});
    required(schemaPath.last_name, {message: "Last name is required"});
    required(schemaPath.email, {message: "Email is required"});
    email(schemaPath.email, {message: "Your email address is invalid"});
    required(schemaPath.password, {message: "Password is required"});
    required(schemaPath.status, {message: "Status is required"});
    required(schemaPath.role, {message: "Role is required"});
    validate(schemaPath.confirmPassword, (ctx) => {
      const value = ctx.value() as string;
      const passwordValue = this.userForm.password().value();

      if (value.length === 0) {
        return { kind: "required", message: "Confirm password is required" };
      }

      if (value && passwordValue && value !== passwordValue) {
        return { kind: "passwordMatch", message: "Passwords must match" };
      }
      return null;
    });
  });
  
  public hasPasswordMatchError = computed(() => 
    this.userForm.confirmPassword().errors().some((error: { kind: string }) => error.kind === "passwordMatch")
  );

  public hasConfirmPasswordRequiredError = computed(() => 
    this.userForm.confirmPassword().errors().some((error: { kind: string }) => error.kind === "required")
  );

  public hasEmailRequiredError = computed(() => 
    this.userForm.email().errors().some((error: { kind: string }) => error.kind === "required")
  );

  public hasEmailInvalidError = computed(() => 
    this.userForm.email().errors().some((error: { kind: string }) => error.kind === "email")
  );

  public isFormInvalid = computed(() => this.userForm().invalid());
  public isFormTouched = computed(() => this.userForm().touched());

  public formLoading = computed(() => this.userStore.formLoading());

  public submitFormLabel = computed(() => this.mode() === "create" ? "Create User" : "Update User");
  public submitFormIcon = computed(() => this.mode() === "create" ? "add" : "edit");
  public submitButonLabel = computed(() => this.mode() === "create" ? "Create User" : "Update User");

  public closeDialog(): void {
    this.dialogRef.close();
  }

  public submitForm(): void {
    if (this.isFormInvalid()) return;
    if (this.mode() === "create") {
      this.createUser();
    }
  }

  public async createUser(): Promise<void> {
    const payload: PostUser = {
      id: crypto.randomUUID(),
      first_name: this.userFormData().first_name,
      last_name: this.userFormData().last_name,
      email: this.userFormData().email,
      status: this.userFormData().status as UserStatus,
      role: this.userFormData().role as UserRoles,
      workspace_id: this.userFormData().workspace_id || null,
      password: this.userFormData().password,
      avatar: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    await this.userStore.createUser(payload);
    this.closeDialog();
  }
}