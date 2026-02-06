import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { GroupFormComponent } from "./components/group-form/group-form.component";
import { GroupCardComponent } from "./components/group-card/group-card.component";
import { GroupsStore } from "@store/groups/groups.store";
import { FormsModule } from "@angular/forms";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
  imports: [
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    GroupCardComponent,
    FormsModule
  ],
})
export class GroupsComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly groupsStore = inject(GroupsStore);

  public groups = computed(() => this.groupsStore.groups());

  public pagination = computed(() => this.groupsStore.pagination());

  public loading = computed(() => this.groupsStore.loading());

  public searchLoading = computed(() => this.groupsStore.searchLoading());

  public searchQuery = signal('');

  public loadMoreLoading = computed(() => this.groupsStore.loadMoreLoading());

  public groupsLengthReached = computed(() => this.groupsStore.groupsLengthReached());

  public ngOnInit(): void {
    this.groupsStore.getGroups({
      page: 1,
      limit: 10,
      total: 0,
    }, {});
  }

  public searchGroups(): void {
    this.groupsStore.searchGroups(this.searchQuery());
  }

  public loadMoreGroups(): void {
    this.groupsStore.loadMoreGroups();
  }

  public openCreateGroupDialog(): void {
    this.dialog.open(GroupFormComponent, {
      width: '100%',
      maxWidth: '600px',
      data: {
        mode: 'create',
      },
    });
  }
}
