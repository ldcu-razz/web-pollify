import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { Component, computed, inject, signal } from "@angular/core";
import { GetPollParticipant, PatchPollParticipants, PostPollParticipants } from "@models/polls/poll-participants.type";
import { form, FormField, required } from "@angular/forms/signals";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { DepartmentsTypeSchema } from "@models/departments/departments.schema";
import { PollDetailsStore } from "@store/poll-details/poll-details.store";
import { PollParticipantsStore } from "@store/poll-details/poll-participants.store";

interface PollPartificipantsFormData {
  mode: 'created' | 'update';
  participant?: GetPollParticipant;
}

@Component({
  selector: 'app-poll-partificipants-form',
  templateUrl: './poll-partificipants-form.component.html',
  styleUrls: ['./poll-partificipants-form.component.scss'],
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogModule, MatIconModule, MatProgressSpinner, MatSelectModule, FormField]
})
export class PollPartificipantsFormComponent {
  private readonly dialogRef = inject(MatDialogRef<PollPartificipantsFormComponent>);
  private readonly data = inject<PollPartificipantsFormData>(MAT_DIALOG_DATA);
  private readonly pollDetailsStore = inject(PollDetailsStore);
  private readonly pollParticipantsStore = inject(PollParticipantsStore);

  public pollId = computed(() => this.pollDetailsStore.poll()?.id ?? '');

  public mode = computed(() => this.data.mode ?? 'created');
  public isCreatedMode = computed(() => this.mode() === 'created');
  public isUpdateMode = computed(() => this.mode() === 'update');

  public participant = computed(() => this.data.participant);

  public title = computed(() => this.isCreatedMode() ? 'Create Participant' : 'Update Participant');

  public participantFormData = signal({
    name: this.isUpdateMode() ? this.participant()?.name ?? '' : '',
    rfid_number: this.isUpdateMode() ? this.participant()?.rfid_number ?? '' : '',
    department: this.isUpdateMode() ? this.participant()?.department ?? '' : '',
  });

  public participantForm = form(this.participantFormData, (schemaPath) => {
    required(schemaPath.name, { message: 'Name is required' });
    required(schemaPath.rfid_number, { message: 'RFID number is required' });
    required(schemaPath.department, { message: 'Department is required' });
  });

  public isFormInvalid = computed(() => this.participantForm().invalid());
  public isFormTouched = computed(() => this.participantForm().touched());

  public submitFormLabel = computed(() => this.isCreatedMode() ? 'Create Participant' : 'Update Participant');

  public formLoading = computed(() => false);

  public departments = computed(() => DepartmentsTypeSchema.options);

  public submitForm(): void {
    if (this.isCreatedMode()) {
      this.createParticipant();
    }

    if (this.isUpdateMode()) {
      this.updateParticipant();
    }
  }

  public async createParticipant(): Promise<void> {
    const payload: PostPollParticipants = {
      id: crypto.randomUUID(),
      name: this.participantFormData().name,
      rfid_number: this.participantFormData().rfid_number,
      department: this.participantFormData().department,
      poll_status: 'pending',
      poll_id: this.pollId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await this.pollParticipantsStore.createPollParticipant(payload);
    this.closeDialog();
  }

  public async updateParticipant(): Promise<void> {
    const payload: PatchPollParticipants = {
      name: this.participantFormData().name,
      rfid_number: this.participantFormData().rfid_number,
      department: this.participantFormData().department,
      updated_at: new Date().toISOString(),
    };

    await this.pollParticipantsStore.updatePollParticipant(this.participant()?.id ?? '', payload);
    this.closeDialog();
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }
} 