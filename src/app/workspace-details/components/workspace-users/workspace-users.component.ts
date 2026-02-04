import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";

@Component({
  selector: 'app-workspace-users',
  templateUrl: './workspace-users.component.html',
  styleUrls: ['./workspace-users.component.scss'],
  imports: [MatCardModule, MatListModule, MatIconModule, MatMenuModule, MatButtonModule]
})
export class WorkspaceUsersComponent {
}