import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { RouterModule } from "@angular/router";
import { ParticipantLogoutConfirmationComponent } from "../participant-logout-confirmation/participant-logout-confirmation.component";

@Component({
  selector: 'app-participant-navbar',
  templateUrl: './participant-navbar.component.html',
  styleUrls: ['./participant-navbar.component.scss'],
  imports: [RouterModule, MatButtonModule]
})
export class ParticipantNavbarComponent {
  private readonly dialog = inject(MatDialog);

  public logout(): void {
    this.dialog.open(ParticipantLogoutConfirmationComponent, {
      width: '100%',
      maxWidth: '520px',
    });
  }
}