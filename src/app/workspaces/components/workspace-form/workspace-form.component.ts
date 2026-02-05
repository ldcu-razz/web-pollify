import { Component, computed, inject, model, signal } from "@angular/core";
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { form, required, FormField } from '@angular/forms/signals';
import { WorkspaceStore } from "@store/workspaces/workspace.store";
import { PostWorkspace, PutWorkspace } from "@models/workspace/workspace.type";

interface WorkspaceForm {
  name: string;
  description: string;
}

type WorkspaceFormMode = "create" | "update";

interface WorkspaceFormDialogData {
  mode?: WorkspaceFormMode;
  workspaceId?: string;
}

@Component({
  selector: 'app-workspace-form',
  templateUrl: './workspace-form.component.html',
  styleUrls: ['./workspace-form.component.scss'],
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormField, MatIconModule, MatProgressSpinnerModule],
})
export class WorkspaceFormComponent {
  private readonly workspaceStore = inject(WorkspaceStore);
  private readonly dialogRef = inject(MatDialogRef<WorkspaceFormComponent>);
  private readonly dialogData = inject<WorkspaceFormDialogData>(MAT_DIALOG_DATA, { optional: true });

  public mode = signal<WorkspaceFormMode>(this.dialogData?.mode ?? "create");

  public workspaceId = signal<string>(this.dialogData?.workspaceId ?? "");

  public currentWorkspace = computed(() => this.workspaceStore.currentWorkspace());
  
  public workspaceFormData = model<WorkspaceForm>({
    name: this.currentWorkspace()?.name ?? "",
    description: this.currentWorkspace()?.description ?? ""
  })

  public title = computed(() => this.mode() === "create" ? "Create Workspace" : "Update Workspace");

  public submitFormLabel = computed(() => this.mode() === "create" ? "Create Workspace" : "Update Workspace");

  public formLoading = computed(() => this.workspaceStore.formLoading());

  public workspaceForm = form(this.workspaceFormData, (schemaPath) => {
    required(schemaPath.name, {message: "Name is required"});
  })

  public isFormInvalid = computed(() => this.workspaceForm().invalid());
  public isFormTouched = computed(() => this.workspaceForm().touched());

  public closeDialog(): void {
    this.dialogRef.close();
  }

  public submitForm(): void {
    if (this.mode() === "create") {
      this.createWorkspace();
    } else {
      this.updateWorkspace();
    }
  }

  public async createWorkspace(): Promise<void> {
    const payload: PostWorkspace = {
      id: crypto.randomUUID(),
      name: this.workspaceFormData().name,
      description: this.workspaceFormData().description,
      avatar: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    await this.workspaceStore.createWorkspace(payload);
    this.closeDialog();
  }

  public async updateWorkspace(): Promise<void> {
    const currentWorkspaceId = this.currentWorkspace()?.id ?? null;
    const payload: PutWorkspace = {
      name: this.workspaceFormData().name,
      description: this.workspaceFormData().description,
      updatedAt: new Date().toISOString(),
    }

    if (currentWorkspaceId) {
      await this.workspaceStore.updateWorkspace(currentWorkspaceId, payload);
    }

    this.closeDialog();
  }
}