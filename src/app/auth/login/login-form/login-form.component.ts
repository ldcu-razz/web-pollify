import { Component, inject, OnInit, signal } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { Router } from "@angular/router";
import { ROUTES as ROUTES_CONSTANTS } from "@constants/routes.constants";

@Component({
  selector: 'app-login-form',
  standalone: true,
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
  imports: [FormsModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule]
})
export class LoginFormComponent implements OnInit {
  private readonly router = inject(Router);

  public hidePassword = signal(false);

  public loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  public togglePasswordVisibility(): void {
    this.hidePassword.set(!this.hidePassword());
  }

  public ngOnInit(): void {
    //
  }

  public navigateToParticipants(): void {
    this.router.navigate([ROUTES_CONSTANTS.AUTH.PARTICIPANTS]);
  }
}