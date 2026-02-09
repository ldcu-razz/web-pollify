import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { MatListModule } from "@angular/material/list";
import { PollParticipantsStore } from "@store/poll-details/poll-participants.store";
import { form, FormField, required } from "@angular/forms/signals";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-poll-import-participants',
  templateUrl: './poll-import-participants.component.html',
  styleUrls: ['./poll-import-participants.component.scss'],
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    FormsModule,
    MatProgressSpinnerModule,
    FormField,
    MatIconModule
  ]
})
export class PollImportParticipantsComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<PollImportParticipantsComponent>);
  private readonly pollParticipantsStore = inject(PollParticipantsStore);

  public searchQuery = signal('');

  public groups = computed(() => this.pollParticipantsStore.groups());

  public groupsSearchQuery = computed(() => this.pollParticipantsStore.groupsSearchQuery());

  public groupsSearchLoading = computed(() => this.pollParticipantsStore.groupsSearchLoading());

  public importingGroupParticipantsLoading = computed(() => this.pollParticipantsStore.importingGroupParticipantsLoading());

  public isGroupsSearchEmpty = computed(() => this.groups().length === 0);

  public groupListFormData = signal({
    groupId: '',
  });

  public groupListForm = form(this.groupListFormData, (schemaPath) => {
    required(schemaPath.groupId, { message: 'Group is required' });
  });

  public isFormInvalid = computed(() => this.groupListForm().invalid());
  
  public ngOnInit(): void {
    this.pollParticipantsStore.searchGroups(this.searchQuery());
  }

  public searchGroups(): void {
    this.pollParticipantsStore.searchGroups(this.searchQuery());
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }

  public async importParticipants(): Promise<void> {
    const groupId = this.groupListForm.groupId().value();
    if (!groupId) {
      return;
    }
    await this.pollParticipantsStore.importGroupParticipants(groupId);
    this.closeDialog();
  }
}