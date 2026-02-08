import { Component, computed, inject, signal } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { FormsModule } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { form, FormField, required } from "@angular/forms/signals";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { PollStore } from "@store/polls/polls.store";
import { PostPoll } from "@models/polls/polls.type";
import { PollStatusSchema } from "@models/polls/polls.schema";

interface PollFormData {
  mode: 'create' | 'update';
}

@Component({
  selector: 'app-poll-form',
  templateUrl: './poll-form.component.html',
  styleUrls: ['./poll-form.component.scss'],
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatIconModule, MatButtonModule, FormsModule, FormField]
})
export class PollFormComponent {
  private readonly dialogRef = inject(MatDialogRef<PollFormComponent>);
  private readonly data = inject<PollFormData>(MAT_DIALOG_DATA);
  private readonly pollsStore = inject(PollStore);

  public formMode = computed(() => this.data.mode ?? 'create');
  public isCreateMode = computed(() => this.formMode() === 'create');
  public isUpdateMode = computed(() => this.formMode() === 'update');

  public title = computed(() => this.isCreateMode() ? 'Create Poll' : 'Update Poll');

  public generatedCode = computed(() => {
    const uuid = crypto.randomUUID().replace(/-/g, '');
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 15; i++) {
      const idx = parseInt(uuid.slice(i * 2, i * 2 + 2), 16) % 36;
      result += chars[idx];
    }
    return `${result.slice(0, 5)}-${result.slice(5, 10)}-${result.slice(10, 15)}`;
  });

  public pollFormData = signal({
    name: '',
    description: '',
    code: '',
  });

  public pollForm = form(this.pollFormData, (schemaPath) => {
    required(schemaPath.name, { message: 'Name is required' });
  });

  public isFormInvalid = computed(() => this.pollForm().invalid());
  public isFormTouched = computed(() => this.pollForm().touched());

  public formLoading = computed(() => false);

  public submitFormLabel = computed(() => this.isCreateMode() ? 'Create Poll' : 'Update Poll');

  public submitForm(): void {
    if (this.isCreateMode()) {
      this.createPoll();
    }
  }

  public async createPoll(): Promise<void> {
    const payload: PostPoll = {
      id: crypto.randomUUID(),
      name: this.pollFormData().name,
      description: this.pollFormData().description,
      code: this.generatedCode(),
      status: PollStatusSchema.enum.draft,
      workspace_id: null,
      date_time_start: null,
      date_time_end: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    await this.pollsStore.createPoll(payload);
    this.closeDialog();
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }
}