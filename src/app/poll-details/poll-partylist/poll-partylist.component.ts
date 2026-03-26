import { Component, computed, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { DatePipe } from "@angular/common";
import { PollDetailsStore } from "@store/poll-details/poll-details.store";
import { PollPartylistStore } from "@store/poll-details/poll-partylist.store";
import { MatDialog } from "@angular/material/dialog";
import { PollPartylistFormComponent } from "./components/poll-partylist-form/poll-partylist-form.component";
import { PollPartylistDeleteConfirmationComponent } from "./components/poll-partylist-delete-confirmation/poll-partylist-delete-confirmation.component";
import { AvatarComponent } from "@components/avatar/avatar.component";

@Component({
  selector: 'app-poll-partylist',
  templateUrl: './poll-partylist.component.html',
  styleUrls: ['./poll-partylist.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    DatePipe,
    AvatarComponent,
  ],
})
export class PollPartylistComponent {
  private readonly pollDetailsStore = inject(PollDetailsStore);
  private readonly pollPartylistStore = inject(PollPartylistStore);
  private readonly dialog = inject(MatDialog);

  public pollId = computed(() => this.pollDetailsStore.poll()?.id ?? "");
  public isPollDraft = computed(() => this.pollDetailsStore.isPollDraft());
  public loading = computed(() => this.pollPartylistStore.loading());
  public partylists = computed(() => this.pollPartylistStore.pollPartylists());
  public displayedColumns = ["avatar", "name", "description", "updated_at", "actions"];

  public openCreatePartylistDialog(): void {
    this.dialog.open(PollPartylistFormComponent, {
      width: "100%",
      maxWidth: "600px",
      data: {
        mode: "create",
        partylist: null,
      },
    });
  }

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