import { Component } from "@angular/core";
import { ParticipantsLoginFormComponent } from "./participants-login-form/participants-login-form.component";
import { FooterComponent } from "@components/footer/footer.component";

@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.css'],
  imports: [ParticipantsLoginFormComponent, FooterComponent]
})
export class ParticipantsComponent {
}