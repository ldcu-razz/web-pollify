import { Component, computed, inject } from "@angular/core";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MainSidebarComponent } from "./components/main-sidebar/main-sidebar.component";
import { RouterOutlet } from "@angular/router";
import { AuthAdminStore } from "@store/auth/auth-admin.store";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  imports: [MatSidenavModule, MainSidebarComponent, RouterOutlet]
})
export class MainComponent {
  private readonly authAdminStore = inject(AuthAdminStore);

  public readonly isSuperAdmin = computed(() => this.authAdminStore.isSuperAdmin());

  public readonly isAdmin = computed(() => this.authAdminStore.isAdmin());
}