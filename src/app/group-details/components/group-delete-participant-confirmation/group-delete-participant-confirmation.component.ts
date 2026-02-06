import { Component, computed, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { GroupDetailsStore } from "@store/groups/group-details.store";

interface GroupDeleteParticipantConfirmationData {
  participantId: string;
}

@Component({
  selector: 'app-group-delete-participant-confirmation',
  templateUrl: './group-delete-participant-confirmation.component.html',
  styleUrls: ['./group-delete-participant-confirmation.component.scss'],
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ]
})
export class GroupDeleteParticipantConfirmationComponent {
  private readonly dialogRef = inject(MatDialogRef<GroupDeleteParticipantConfirmationComponent>);
  private readonly data = inject<GroupDeleteParticipantConfirmationData>(MAT_DIALOG_DATA);
  private readonly groupDetailsStore = inject(GroupDetailsStore);

  public participantId = computed(() => this.data.participantId);

  public deletingParticipantLoading = computed(() => this.groupDetailsStore.deletingParticipantLoading());

  public closeDialog(): void {
    this.dialogRef.close();
  }

  public async deleteParticipant(): Promise<void> {
    await this.groupDetailsStore.deleteParticipant(this.participantId());
    this.closeDialog();
  }
} 