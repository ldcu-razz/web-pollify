import { Component } from '@angular/core';
import { LoginFormComponent } from './login-form/login-form.component';
import { FooterComponent } from '@components/footer/footer.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [LoginFormComponent, FooterComponent]
})
export class LoginComponent {
}