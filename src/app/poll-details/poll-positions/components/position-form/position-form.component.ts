import { Component, computed, inject, model, signal, viewChild } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInput, MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { PollPositionsStore } from "@store/poll-details/poll-positions.store";
import { GetPollPosition, PatchPollPosition, PostPollPosition } from "@models/polls/poll-positions.type";
import { disabled, form, FormField, required } from "@angular/forms/signals";
import { PollDetailsStore } from "@store/poll-details/poll-details.store";
import { MatChipsModule } from "@angular/material/chips";
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { PollCandidatesStore } from "@store/poll-details/poll-candidates.store";
import { PollCandidate } from "@models/polls/poll-candidate.type";
import { FormsModule } from "@angular/forms";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { AvatarComponent } from "@components/avatar/avatar.component";

interface PositionFormData {
  mode: 'create' | 'update';
  position: GetPollPosition;
}

@Component({
  selector: 'app-position-form',
  templateUrl: './position-form.component.html',
  styleUrls: ['./position-form.component.scss'],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatAutocompleteModule,
    FormField,
    FormsModule,
    AvatarComponent
  ]
})
export class PositionFormComponent {
  private readonly dialogRef = inject(MatDialogRef<PositionFormComponent>);
  private readonly data = inject<PositionFormData>(MAT_DIALOG_DATA);
  private readonly pollDetailsStore = inject(PollDetailsStore);
  private readonly pollPositionsStore = inject(PollPositionsStore);
  private readonly pollCandidatesStore = inject(PollCandidatesStore);
  public readonly announcer = inject(LiveAnnouncer);

  public isPollDraft = computed(() => this.pollDetailsStore.isPollDraft());

  public candidateInput = viewChild<MatInput>('candidateInput');

  public pollId = computed(() => this.pollDetailsStore.poll()?.id ?? '');

  public pollPosition = computed(() => this.pollPositionsStore.pollPositions().find(position => position.id === this.position().id));

  public pollPositionCandidates = computed(() => this.pollPosition()?.poll_candidates ?? []);

  public mode = computed(() => this.data.mode ?? 'create');
  public isCreateMode = computed(() => this.mode() === 'create');
  public isUpdateMode = computed(() => this.mode() === 'update');

  public title = computed(() => this.isCreateMode() ? 'Create Position' : 'Update Position');

  public position = computed(() => this.data.position);

  public lastPositionNumber = computed(() => this.pollPositionsStore.lastPositionNumber());

  public positionFormData = signal({
    position: this.isUpdateMode() ? this.position()?.position ?? this.lastPositionNumber() : this.lastPositionNumber(),
    name: this.isUpdateMode() ? this.position()?.name ?? '' : '',
  });

  public selectedCandidates = signal<PollCandidate[]>(
    this.isUpdateMode() ? this.pollPositionCandidates() : []
  );

  public removedCandidates = signal<PollCandidate[]>([]);

  public currentCandidateQuery = model('');

  public pollCandidates = computed(() => this.pollCandidatesStore.candidates());

  public pollNonSelectedCandidatesPosition = computed(() => this.pollCandidates().filter(candidate => !candidate.poll_position_id));

  public filteredCandidates = computed(() => {
    const search = (this.currentCandidateQuery() ?? '').trim().toLowerCase();
    const nonSelectedCandidates = this.pollCandidates()
      .filter(candidate => !this.selectedCandidates().some(positionCandidate => positionCandidate.id === candidate.id))
      .filter(candidate => this.pollNonSelectedCandidatesPosition().some(positionCandidate => positionCandidate.id === candidate.id));

    const candidates = nonSelectedCandidates;
    return candidates.filter(
      candidate =>
        (search === '' || (candidate.name ?? '').toLowerCase().includes(search))
    );
  });

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  public positionForm = form(this.positionFormData, (schemaPath) => {
    required(schemaPath.position, { message: 'Position is required' });
    disabled(schemaPath.position);
    required(schemaPath.name, { message: 'Name is required' });
  });

  public isFormInvalid = computed(() => this.positionForm().invalid());
  public isFormTouched = computed(() => this.positionForm().touched());

  public formLoading = computed(() => this.pollPositionsStore.formLoading());

  public updatingPollPosition = computed(() => this.pollPositionsStore.updatingPollPosition());

  public submitFormLabel = computed(() => this.isCreateMode() ? 'Create Position' : 'Update Position');

  public selectCandidate(event: MatAutocompleteSelectedEvent): void {
    this.selectedCandidates.set([...this.selectedCandidates(), event.option.value]);
  }

  public removeCandidate(candidate: PollCandidate): void {
    this.selectedCandidates.set(this.selectedCandidates().filter(selectedCandidate => selectedCandidate.id !== candidate.id));
    this.removedCandidates.set([...this.removedCandidates(), candidate]);
  }

  public submitForm(): void {
    if (this.isCreateMode()) {
      this.createPosition();
    }

    if (this.isUpdateMode()) {
      this.updatePosition();
    }
  }

  public async createPosition(): Promise<void> {
    const payload: PostPollPosition = {
      id: crypto.randomUUID(),
      position: this.positionFormData().position as number,
      name: this.positionFormData().name,
      poll_id: this.pollId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const selectedCandidatesIds = this.selectedCandidates().map(candidate => candidate.id ?? '');
    await this.pollPositionsStore.createPollPosition(payload, selectedCandidatesIds);
    this.closeDialog();
  }

  public async updatePosition(): Promise<void> {
    const payload: PatchPollPosition = {
      position: this.positionFormData().position as number,
      name: this.positionFormData().name,
      updated_at: new Date().toISOString(),
    };
    await this.pollPositionsStore.updatePollPosition(this.position().id, payload);

    const selectedCandidatesIds = this.selectedCandidates().map(candidate => candidate.id ?? '');
    const removedCandidatesIds = this.removedCandidates().map(candidate => candidate.id ?? '');
    await this.pollPositionsStore.modifyPollPositionCandidates(this.position().id, selectedCandidatesIds, removedCandidatesIds);

    this.closeDialog();
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }
}