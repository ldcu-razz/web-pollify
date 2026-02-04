import { Component } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: 'app-workspace-polls',
  templateUrl: './workspace-polls.component.html',
  styleUrls: ['./workspace-polls.component.scss'],
  imports: [MatCardModule, MatListModule, MatIconModule, MatMenuModule, MatButtonModule]
})
export class WorkspacePollsComponent {
}