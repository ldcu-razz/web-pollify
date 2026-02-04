import { Component } from "@angular/core";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MainSidebarComponent } from "./components/main-sidebar/main-sidebar.component";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  imports: [MatSidenavModule, MainSidebarComponent, RouterOutlet]
})
export class MainComponent {
}