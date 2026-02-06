import { Component, computed, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { GroupsStore } from "@store/groups/groups.store";

interface GroupDeleteConfirmationData {
  groupId: string;
}

@Component({
  selector: 'app-group-delete-confirmation',
  templateUrl: './group-delete-confirmation.component.html',
  styleUrls: ['./group-delete-confirmation.component.scss'],
  imports: [MatDialogModule, MatProgressSpinnerModule, MatButtonModule]
})
export class GroupDeleteConfirmationComponent {
  private readonly dialogRef = inject(MatDialogRef<GroupDeleteConfirmationComponent>);
  private readonly data = inject<GroupDeleteConfirmationData>(MAT_DIALOG_DATA);
  private readonly groupsStore = inject(GroupsStore);

  public groupId = computed(() => this.data.groupId);

  public groupMap = computed(() => this.groupsStore.groupMap());

  public group = computed(() => this.groupMap().get(this.groupId()));

  public deletingGroupLoading = computed(() => this.groupsStore.deletingGroupLoading());

  public closeDialog(): void {
    this.dialogRef.close();
  }

  public async deleteGroup(): Promise<void> {
    await this.groupsStore.deleteGroup(this.groupId());
    this.closeDialog();
  }
}