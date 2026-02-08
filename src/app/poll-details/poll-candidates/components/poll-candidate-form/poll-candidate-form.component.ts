import { Component, computed, inject, signal } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { GetPollCandidate, PatchPollCandidate, PostPollCandidate } from "@models/polls/poll-candidate.type";
import { form, FormField, required } from "@angular/forms/signals";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { PollCandidatesStore } from "@store/poll-details/poll-candidates.store";
import { PollDetailsStore } from "@store/poll-details/poll-details.store";

interface PollCandidateFormData {
  mode: 'create' | 'update';
  candidate: GetPollCandidate;
}

@Component({
  selector: 'app-poll-candidate-form',
  templateUrl: './poll-candidate-form.component.html',
  styleUrls: ['./poll-candidate-form.component.scss'],
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatDialogModule, MatProgressSpinnerModule, FormField]
})
export class PollCandidateFormComponent {
  private readonly dialogRef = inject(MatDialogRef<PollCandidateFormComponent>);
  private readonly data = inject<PollCandidateFormData>(MAT_DIALOG_DATA);
  private readonly pollCandidatesStore = inject(PollCandidatesStore);
  private readonly pollDetailsStore = inject(PollDetailsStore);

  public mode = computed(() => this.data.mode ?? 'create');
  public isCreateMode = computed(() => this.mode() === 'create');
  public isUpdateMode = computed(() => this.mode() === 'update');

  public title = computed(() => this.isCreateMode() ? 'Create Candidate' : 'Update Candidate');

  public candidate = computed(() => this.data.candidate);

  public poolId = computed(() => this.pollDetailsStore.poll()?.id ?? '');

  public candidateFormData = signal({
    name: this.isUpdateMode() ? this.candidate()?.name ?? '' : '',
    description: this.isUpdateMode() ? this.candidate()?.description ?? '' : '',
    avatar: this.isUpdateMode() ? this.candidate()?.avatar ?? '' : '',
  });

  public candidateForm = form(this.candidateFormData, (schemaPath) => {
    required(schemaPath.name, { message: 'Name is required' });
  });

  public isFormInvalid = computed(() => this.candidateForm().invalid());
  public isFormTouched = computed(() => this.candidateForm().touched());

  public submitFormLabel = computed(() => this.mode() === 'create' ? 'Create Candidate' : 'Update Candidate');

  public formLoading = computed(() => false);

  public submitForm(): void {
    if (this.isCreateMode()) {
      this.createPollCandidate();
    } else {
      this.updatePollCandidate();
    }
  }

  public createPollCandidate(): void {
    const payload: PostPollCandidate = {
      id: crypto.randomUUID(),
      name: this.candidateFormData().name,
      description: this.candidateFormData().description,
      avatar: this.candidateFormData().avatar,
      poll_id: this.poolId(),
      poll_position_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    this.pollCandidatesStore.createPollCandidate(this.poolId(), payload);
    this.closeDialog();
  }

  public updatePollCandidate(): void {
    const payload: PatchPollCandidate = {
      name: this.candidateFormData().name,
      description: this.candidateFormData().description,
      avatar: this.candidateFormData().avatar,
      updated_at: new Date().toISOString(),
    }

    this.pollCandidatesStore.updatePollCandidate(this.candidate()?.id ?? '', payload);
    this.closeDialog();
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }
}