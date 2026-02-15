import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { Router } from "@angular/router";
import { ROUTES as ROUTES_CONSTANTS } from "@constants/routes.constants";
import { AuthAdminStore } from "@store/auth/auth-admin.store";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  selector: 'app-login-form',
  standalone: true,
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
  imports: [FormsModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule]
})
export class LoginFormComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authAdminStore = inject(AuthAdminStore);

  public hidePassword = signal(false);

  public logginInLoading = computed(() => this.authAdminStore.logginInLoading());

  public loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  public togglePasswordVisibility(): void {
    this.hidePassword.set(!this.hidePassword());
  }

  public ngOnInit(): void {
    // TODO: add logic to login
    console.log('login form');
  }

  public async login(): Promise<void> {
    try {
      await this.authAdminStore.loginAdmin(this.loginForm.value.email ?? '', this.loginForm.value.password ?? '');
      this.router.navigate([ROUTES_CONSTANTS.MAIN.BASE]);
    } catch (error) {
      console.error(error);
    }
  }

  public navigateToParticipants(): void {
    this.router.navigate([ROUTES_CONSTANTS.AUTH.PARTICIPANTS]);
  }
}