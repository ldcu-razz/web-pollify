import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { Component } from "@angular/core";

@Component({
  selector: 'app-participants-login-form',
  standalone: true,
  templateUrl: './participants-login-form.component.html',
  styleUrls: ['./participants-login-form.component.css'],
  imports: [FormsModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule]
})
export class ParticipantsLoginFormComponent {

  public loginForm = new FormGroup({
    rfid_number: new FormControl(''),
    code: new FormControl(''),
  });
} 