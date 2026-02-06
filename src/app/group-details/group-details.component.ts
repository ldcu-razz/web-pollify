import { Component, computed, inject, OnDestroy, OnInit, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { ActivatedRoute, Router } from "@angular/router";
import { ROUTES as ROUTES_CONSTANTS } from "@constants/routes.constants";
import { GroupParticipantFormComponent } from "./components/group-participant-form/group-participant-form.component";
import { GroupDetailsStore } from "@store/groups/group-details.store";
import { GroupParticipantsTableComponent } from "./components/group-participants-table/group-participants-table.component";
import { GroupParticipantImportComponent } from "./components/group-participant-import/group-participant-import.component";
import { MatInputModule } from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { GroupFormComponent } from "../groups/components/group-form/group-form.component";

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.scss'],
  imports: [MatButtonModule, MatIconModule, MatInputModule, GroupParticipantsTableComponent, FormsModule]
})
export class GroupDetailsComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router); 
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly groupDetailsStore = inject(GroupDetailsStore);
  
  public groupId = computed(() => this.route.snapshot.params['id']);

  public group = computed(() => this.groupDetailsStore.group());

  public pagination = computed(() => this.groupDetailsStore.pagination());

  public loading = computed(() => this.groupDetailsStore.loading());

  public searchQuery = signal('');

  public ngOnInit(): void {
    this.groupDetailsStore.getGroupDetails(this.groupId());
    this.groupDetailsStore.getGroupParticipants(this.pagination(), this.groupId());
  }

  public openEditGroupDialog(): void {
    this.dialog.open(GroupFormComponent, {
      width: '100%',
      maxWidth: '800px',
      data: {
        mode: 'update',
      }
    });
  }
  
  public openAddParticipantDialog(): void {
    this.dialog.open(GroupParticipantFormComponent, {
      width: '100%',
      maxWidth: '800px',
      data: {
        mode: 'create',
        groupId: this.groupId(),
      }
    });
  }

  public openImportParticipantDialog(): void {
    this.dialog.open(GroupParticipantImportComponent, {
      width: '100%',
      maxWidth: '600px',
      disableClose: true,
      data: {
        groupId: this.groupId(),
      }
    });
  }

  public navigateToGroups(): void {
    this.router.navigate([
      ROUTES_CONSTANTS.MAIN.BASE,
      ROUTES_CONSTANTS.MAIN.GROUPS,
    ]);
  }

  public ngOnDestroy(): void {
    this.groupDetailsStore.resetGroupParticipants();
  }
}