import { Component, inject, OnInit, signal } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { ActivatedRoute, Router } from "@angular/router";
import { GetPoll } from "@models/polls/polls.type";
import { WorkspaceStore } from "@store/workspaces/workspace.store";
import { TextTransformPipe } from "@pipes/text-transform.pipe";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ROUTES as ROUTES_CONSTANTS } from "@constants/routes.constants";

@Component({
  selector: 'app-workspace-polls',
  templateUrl: './workspace-polls.component.html',
  styleUrls: ['./workspace-polls.component.scss'],
  imports: [MatCardModule, MatListModule, MatIconModule, MatMenuModule, MatButtonModule, TextTransformPipe, MatProgressSpinnerModule]
})
export class WorkspacePollsComponent implements OnInit {
  private readonly workspaceStore = inject(WorkspaceStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  public polls = signal<GetPoll[]>([]);

  public loading = signal<boolean>(false);

  public async ngOnInit(): Promise<void> {
    const workspaceId = this.route.snapshot.params['id'];
    if (workspaceId) {
      this.loading.set(true);
      const result = await this.workspaceStore.getWorkspacePolls(workspaceId);
      this.polls.set(result);
      this.loading.set(false);
    }
  }

  public navigateToPollDetails(pollId: string): void {
    this.router.navigate([
      ROUTES_CONSTANTS.MAIN.BASE,
      ROUTES_CONSTANTS.MAIN.POLLS,
      pollId,
    ]);
  }
}