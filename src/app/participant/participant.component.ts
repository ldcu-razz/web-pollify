import { Component, computed, inject, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ParticipantNavbarComponent } from "./components/participant-navbar/participant-navbar.component";
import { AuthParticipantsStore } from "@store/auth/auth-participants.store";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  selector: 'app-participant',
  templateUrl: './participant.component.html',
  styleUrls: ['./participant.component.scss'],
  imports: [RouterOutlet, ParticipantNavbarComponent, MatProgressSpinnerModule]
})
export class ParticipantComponent implements OnInit {
  private readonly authParticipantsStore = inject(AuthParticipantsStore);

  public pollParticipantId = computed(() => this.authParticipantsStore.session()?.poll_participant_id ?? null);

  public pollParticipantLoading = computed(() => this.authParticipantsStore.pollParticipantLoading());

  public async ngOnInit(): Promise<void> {
    await this.authParticipantsStore.getPollParticipant(this.pollParticipantId() ?? '');
  }
}