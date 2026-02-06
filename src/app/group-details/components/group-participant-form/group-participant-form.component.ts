import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatDialogRef } from "@angular/material/dialog";
import { form, FormField, required } from "@angular/forms/signals";
import { GroupDetailsStore } from "@store/groups/group-details.store";
import { DepartmentsTypeSchema } from "@models/departments/departments.schema";
import { WorkspaceStore } from "@store/workspaces/workspace.store";
import { PostParticipants } from "@models/participants/participants.type";

interface GroupParticipantFormProps {
  mode: 'create' | 'update';
  groupId: string;
}

@Component({
  selector: 'app-group-participant-form',
  templateUrl: './group-participant-form.component.html',
  styleUrls: ['./group-participant-form.component.scss'],
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, FormField]
})
export class GroupParticipantFormComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef);
  private readonly data = inject<GroupParticipantFormProps>(MAT_DIALOG_DATA);
  private readonly groupDetailsStore = inject(GroupDetailsStore);
  private readonly workspaceStore = inject(WorkspaceStore);

  public mode = computed(() => this.data.mode ?? 'create');

  public groupId = computed(() => this.data.groupId);

  public title = computed(() => this.mode() === 'create' ? 'Create Participant' : 'Update Participant');

  public groupParticipantData = signal({
    name: '',
    rfid_number: '',
    department: '',
    workspace_id: '',
  });

  public groupParticipantForm = form(this.groupParticipantData, (schemaPath) => {
    required(schemaPath.name, { message: 'Name is required' });
    required(schemaPath.rfid_number, { message: 'RFID number is required' });
    required(schemaPath.department, { message: 'Department is required' });
    required(schemaPath.workspace_id, { message: 'Workspace is required' });
  })

  public isFormInvalid = computed(() => this.groupParticipantForm().invalid());
  public isFormTouched = computed(() => this.groupParticipantForm().touched());
  public formLoading = computed(() => this.groupDetailsStore.formLoading());

  public submitFormLabel = computed(() => this.mode() === 'create' ? 'Add Participant' : 'Update Participant');

  public departments = computed(() => DepartmentsTypeSchema.options);

  public workspaces = computed(() => this.workspaceStore.workspaces());


  public ngOnInit(): void {
    // this.mode.set(this.data.mode);
    // TODO: add logic to get participants
    console.log('group participant form');
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }

  public submitForm(): void {
    if (this.mode() === 'create') {
      this.addGroupParticipant();
    }
  }

  public async addGroupParticipant(): Promise<void> {
    const payload: PostParticipants = {
      id: crypto.randomUUID(),
      rfid_number: this.groupParticipantData().rfid_number,
      name: this.groupParticipantData().name,
      department: this.groupParticipantData().department,
      workspace_id: this.groupParticipantData().workspace_id,
      group_id: this.groupId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await this.groupDetailsStore.addGroupParticipant(payload);
    this.closeDialog();
  }
}