import { Component, OnInit } from "@angular/core";
import { ParticipantsLoginFormComponent } from "./participants-login-form/participants-login-form.component";

@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.css'],
  imports: [ParticipantsLoginFormComponent]
})
export class ParticipantsComponent implements OnInit {

  public ngOnInit(): void {
    //
  }
}