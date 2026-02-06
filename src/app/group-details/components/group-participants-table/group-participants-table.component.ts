import { Component, computed, inject } from "@angular/core";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { GroupDetailsStore } from "@store/groups/group-details.store";
import { MatChipsModule } from "@angular/material/chips";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { GroupDeleteParticipantConfirmationComponent } from "../group-delete-participant-confirmation/group-delete-participant-confirmation.component";
import { MatDialog } from "@angular/material/dialog";
import { DatePipe } from "@angular/common";

@Component({
  selector: 'app-group-participants-table',
  templateUrl: './group-participants-table.component.html',
  styleUrls: ['./group-participants-table.component.scss'],
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatIconModule,
    MatChipsModule,
    MatButtonModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    DatePipe
  ]
})
export class GroupParticipantsTableComponent {
  private readonly groupDetailsStore = inject(GroupDetailsStore);
  private readonly dialog = inject(MatDialog);

  public participants = computed(() => this.groupDetailsStore.participants());

  public pagination = computed(() => this.groupDetailsStore.pagination());

  public loading = computed(() => this.groupDetailsStore.loading());

  public displayedColumns = ['rfid_number', 'name', 'department', 'created_at', 'actions'];

  public openDeleteParticipantConfirmationDialog(participantId: string): void {
    this.dialog.open(GroupDeleteParticipantConfirmationComponent, {
      width: '100%',
      maxWidth: '600px',
      data: {
        participantId: participantId,
      }
    });
  }
}