import { Component, computed, inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { PollPartylistStore } from "@store/poll-details/poll-partylist.store";

interface PollPartylistDeleteConfirmationData {
  partylistId: string;
}

@Component({
  selector: "app-poll-partylist-delete-confirmation",
  templateUrl: "./poll-partylist-delete-confirmation.component.html",
  styleUrls: ["./poll-partylist-delete-confirmation.component.scss"],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatProgressSpinnerModule],
})
export class PollPartylistDeleteConfirmationComponent {
  private readonly dialogRef = inject(MatDialogRef<PollPartylistDeleteConfirmationComponent>);
  private readonly data = inject<PollPartylistDeleteConfirmationData>(MAT_DIALOG_DATA);
  private readonly pollPartylistStore = inject(PollPartylistStore);

  public partylistId = computed(() => this.data.partylistId);
  public deletingPartylistLoading = computed(() => this.pollPartylistStore.deletingPollPartylist());

  public closeDialog(): void {
    this.dialogRef.close();
  }

  public async deletePartylist(): Promise<void> {
    await this.pollPartylistStore.deletePollPartylist(this.partylistId());
    this.closeDialog();
  }
}

