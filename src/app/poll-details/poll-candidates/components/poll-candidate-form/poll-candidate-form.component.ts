import { Component, computed, inject, OnInit, signal } from "@angular/core";
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
import { AvatarComponent } from "@components/avatar/avatar.component";
import { MatSelectModule } from "@angular/material/select";
import { PollPartylistStore } from "@store/poll-details/poll-partylist.store";

interface PollCandidateFormData {
  mode: 'create' | 'update';
  candidate: GetPollCandidate;
}

@Component({
  selector: 'app-poll-candidate-form',
  templateUrl: './poll-candidate-form.component.html',
  styleUrls: ['./poll-candidate-form.component.scss'],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    FormField,
    AvatarComponent,
    MatSelectModule
  ]
})
export class PollCandidateFormComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<PollCandidateFormComponent>);
  private readonly data = inject<PollCandidateFormData>(MAT_DIALOG_DATA);
  private readonly pollCandidatesStore = inject(PollCandidatesStore);
  private readonly pollDetailsStore = inject(PollDetailsStore);
  private readonly pollPartylistStore = inject(PollPartylistStore);

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
    pollPartylistId: this.isUpdateMode() ? this.candidate()?.poll_partylist_id ?? '' : '',
  });

  public candidateForm = form(this.candidateFormData, (schemaPath) => {
    required(schemaPath.name, { message: 'Name is required' });
    required(schemaPath.pollPartylistId, { message: 'Partylist is required' });
  });

  public isFormInvalid = computed(() => this.candidateForm().invalid());
  public isFormTouched = computed(() => this.candidateForm().touched());

  public partylists = computed(() => this.pollPartylistStore.pollPartylists());

  public submitFormLabel = computed(() => this.mode() === 'create' ? 'Create Candidate' : 'Update Candidate');

  public formLoading = computed(() => false);

  public ngOnInit(): void {
    // Ensure the partylist options are available for the dropdown.
    // Store handles caching (returns early when already loaded).
    void this.pollPartylistStore.getPollPartylists(this.poolId());
  }

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
      poll_partylist_id: this.candidateFormData().pollPartylistId as string,
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
      poll_partylist_id: this.candidateFormData().pollPartylistId as string,
      updated_at: new Date().toISOString(),
    }

    this.pollCandidatesStore.updatePollCandidate(this.candidate()?.id ?? '', payload);
    this.closeDialog();
  }

  public onAvatarSaved(avatar: string): void {
    this.candidateFormData.set({
      ...this.candidateFormData(),
      avatar,
    });
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }
}