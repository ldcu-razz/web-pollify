import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { Component, computed, inject } from "@angular/core";
import { AuthParticipantsStore } from "@store/auth/auth-participants.store";
import { Router } from "@angular/router";
import { ROUTES as ROUTES_CONSTANTS } from "@constants/routes.constants";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  selector: 'app-participants-login-form',
  templateUrl: './participants-login-form.component.html',
  styleUrls: ['./participants-login-form.component.css'],
  imports: [FormsModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule]
})
export class ParticipantsLoginFormComponent {
  private readonly authParticipantsStore = inject(AuthParticipantsStore);
  private readonly router = inject(Router);

  public logginInLoading = computed(() => this.authParticipantsStore.logginInLoading());
  
  public loginForm = new FormGroup({
    rfid_number: new FormControl(''),
    code: new FormControl(''),
  });

  public async login(): Promise<void> {
    try {
      const result = await this.authParticipantsStore.loginParticipants(this.loginForm.value.rfid_number ?? '', this.loginForm.value.code ?? '');
      if (result) {
        this.router.navigate([ROUTES_CONSTANTS.PARTICIPANT.BASE]);
      }
    } catch (error) {
      console.error(error);
    }
  }
} 