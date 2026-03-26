import { Component, computed, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTableModule } from "@angular/material/table";
import { DatePipe } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
import { PollPartylistStore } from "@store/poll-details/poll-partylist.store";
import { PollDetailsStore } from "@store/poll-details/poll-details.store";
import { AvatarComponent } from "@components/avatar/avatar.component";
import { PollPartylistDeleteConfirmationComponent } from "../poll-partylist-delete-confirmation/poll-partylist-delete-confirmation.component";
import { PollPartylistFormComponent } from "../poll-partylist-form/poll-partylist-form.component";

@Component({
  selector: "app-poll-partylist-table",
  templateUrl: "./poll-partylist-table.component.html",
  styleUrls: ["./poll-partylist-table.component.scss"],
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    DatePipe,
    AvatarComponent,
  ],
})
export class PollPartylistTableComponent {
  private readonly pollDetailsStore = inject(PollDetailsStore);
  private readonly pollPartylistStore = inject(PollPartylistStore);
  private readonly dialog = inject(MatDialog);

  public partylists = computed(() => this.pollPartylistStore.pollPartylists());
  public loading = computed(() => this.pollPartylistStore.loading());
  public isPollDraft = computed(() => this.pollDetailsStore.isPollDraft());

  public displayedColumns = ["avatar", "name", "description", "updated_at", "actions"];

  public openEditPartylistDialog(partylistId: string): void {
    const partylist = this.partylists().find((p) => p.id === partylistId);
    if (!partylist) {
      return;
    }

    this.dialog.open(PollPartylistFormComponent, {
      width: "100%",
      maxWidth: "600px",
      data: {
        mode: "update",
        partylist,
      },
    });
  }

  public openDeletePartylistConfirmationDialog(partylistId: string): void {
    this.dialog.open(PollPartylistDeleteConfirmationComponent, {
      width: "100%",
      maxWidth: "600px",
      data: {
        partylistId,
      },
    });
  }
}

