import { Component, computed, inject, signal } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { MatOptionModule } from "@angular/material/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { GroupsStore } from "@store/groups/groups.store";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { form, required, FormField, disabled } from "@angular/forms/signals";
import { WorkspaceStore } from "@store/workspaces/workspace.store";
import { PatchGroup, PostGroup } from "@models/groups/groups.type";
import { GroupDetailsStore } from "@store/groups/group-details.store";
import { AuthAdminStore } from "@store/auth/auth-admin.store";

interface GroupFormData {
  mode: 'create' | 'update';
}

@Component({
  selector: 'app-group-form',
  templateUrl: './group-form.component.html',
  styleUrls: ['./group-form.component.scss'],
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatOptionModule, MatProgressSpinnerModule, FormField]
})
export class GroupFormComponent {
  private readonly dialogRef = inject(MatDialogRef<GroupFormComponent>);
  private readonly data = inject<GroupFormData>(MAT_DIALOG_DATA);
  private readonly authAdminStore = inject(AuthAdminStore);
  private readonly groupsStore = inject(GroupsStore);
  private readonly groupDetailsStore = inject(GroupDetailsStore);
  private readonly workspaceStore = inject(WorkspaceStore);
  
  public formMode = computed(() => this.data.mode ?? 'create');
  
  public currentGroup = computed(() => this.groupsStore.currentGroup());
  
  public groupDetails = computed(() => this.groupDetailsStore.group());
  
  private isCreateMode = computed(() => this.formMode() === 'create');
  
  private isUpdateMode = computed(() => this.formMode() === 'update');
  
  public title = computed(() => this.isCreateMode() ? 'Create Group' : 'Update Group');
  
  public isAdmin = computed(() => this.authAdminStore.isAdmin());
  
  public workspaceId = computed(() => this.authAdminStore.workspaceId());


  public groupFormData = signal({
    name: this.isUpdateMode() ? this.groupDetails()?.name ?? '' : '',
    description: this.isUpdateMode() ? this.groupDetails()?.description ?? '' : '',
    workspace_id: this.isUpdateMode() ? this.groupDetails()?.workspace_id ?? '' : (this.isAdmin() ? this.workspaceId() ?? '' : ''),
  }); 

  public groupForm = form(this.groupFormData, (schemaPath) => {
    required(schemaPath.name, { message: 'Name is required' });
    required(schemaPath.workspace_id, { message: 'Workspace is required' });
    if (this.isAdmin()) {
      disabled(schemaPath.workspace_id);
    }
  });

  public isFormInvalid = computed(() => this.groupForm().invalid());
  public isFormTouched = computed(() => this.groupForm().touched());
  public formLoading = computed(() => this.groupsStore.formLoading());

  public submitFormLabel = computed(() => this.formMode() === 'create' ? 'Create Group' : 'Update Group');

  public workspaces = computed(() => this.workspaceStore.workspaces());

  public closeDialog(): void {
    this.dialogRef.close();
  }

  public submitForm(): void {
    if (this.formMode() === 'create') {
      this.createGroup();
    } else {
      this.updateGroup();
    }
  }

  private async createGroup(): Promise<void> {
    const payload: PostGroup = {
      id: crypto.randomUUID(),
      name: this.groupFormData().name,
      description: this.groupFormData().description,
      workspace_id: this.groupFormData().workspace_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    await this.groupsStore.createGroup(payload);
    this.closeDialog();
  }

  private async updateGroup(): Promise<void> {
    const payload: PatchGroup = {
      name: this.groupFormData().name,
      description: this.groupFormData().description,
      workspace_id: this.groupFormData().workspace_id,
      updated_at: new Date().toISOString(),
    };
    await this.groupDetailsStore.updateGroupDetails(this.groupDetails()?.id ?? '', payload);
    this.closeDialog();
  }
}