import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { Router } from "@angular/router";
import { ROUTES as ROUTES_CONSTANTS } from "@constants/routes.constants";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [MatButtonModule, MatIconModule]
})
export class HomeComponent {
  public router = inject(Router);

  public navigateToCreatePoll(): void {
    this.router.navigate([ROUTES_CONSTANTS.MAIN.BASE, ROUTES_CONSTANTS.MAIN.POLLS]);
  }

  public navigateToAddGroup(): void {
    this.router.navigate([ROUTES_CONSTANTS.MAIN.BASE, ROUTES_CONSTANTS.MAIN.GROUPS]);
  }
}