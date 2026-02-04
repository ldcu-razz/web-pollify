import { Component, OnInit } from '@angular/core';
import { LoginFormComponent } from './login-form/login-form.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [LoginFormComponent]
})
export class LoginComponent implements OnInit {

  public ngOnInit(): void {
    // TODO: add logic to get login
    console.log('login');
  }
}