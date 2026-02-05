import { Component, inject, input } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { Workspace } from "@models/workspace/workspace.type";
import { MatButtonModule } from "@angular/material/button";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Router } from "@angular/router";
import { ROUTES as ROUTES_CONSTANTS } from "@constants/routes.constants";
import { AvatarComponent } from "@components/avatar/avatar.component";

@Component({
  selector: 'app-workspace-card',
  templateUrl: './workspace-card.component.html',
  styleUrls: ['./workspace-card.component.scss'],
  imports: [MatCardModule, MatButtonModule, MatChipsModule, MatIconModule, MatTooltipModule, AvatarComponent]
})
export class WorkspaceCardComponent {
  private router = inject(Router);

  public workspace = input<Workspace>();

  public navigateToWorkspaceDetails(): void {
    this.router.navigate([
      ROUTES_CONSTANTS.MAIN.BASE,
      ROUTES_CONSTANTS.MAIN.WORKSPACES,
      this.workspace()?.id ?? '',
    ]);
  }
}