import { Component, inject, input } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { GetGroup } from "@models/groups/groups.type";
import { Router } from "@angular/router";
import { ROUTES as ROUTES_CONSTANTS } from "@constants/routes.constants";
import { GroupDeleteConfirmationComponent } from "../group-delete-confirmation/group-delete-confirmation.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'app-group-card',
  templateUrl: './group-card.component.html',
  styleUrls: ['./group-card.component.scss'],
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatMenuModule, MatProgressSpinnerModule, MatTooltipModule]
})
export class GroupCardComponent {
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  public group = input.required<GetGroup>();

  public navigateToGroupDetails(): void {
    this.router.navigate([
      ROUTES_CONSTANTS.MAIN.BASE,
      ROUTES_CONSTANTS.MAIN.GROUPS,
      this.group().id,
    ]);
  }

  public openDeleteGroupConfirmationDialog(): void {
    this.dialog.open(GroupDeleteConfirmationComponent, {
      width: '100%',
      maxWidth: '600px',
      data: {
        groupId: this.group().id,
      },
    });
  }
}