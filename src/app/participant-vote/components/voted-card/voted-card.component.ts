import { Component, computed, input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { GetPollVoting } from "@models/polls/poll-votings.type";
import { MatListModule } from "@angular/material/list";
import { AvatarComponent } from "@components/avatar/avatar.component";

@Component({
  selector: 'app-voted-card',
  templateUrl: './voted-card.component.html',
  styleUrls: ['./voted-card.component.scss'],
  imports: [CommonModule, MatCardModule, MatListModule, AvatarComponent]
})
export class VotedCardComponent {
  public pollVoting = input.required<GetPollVoting>();

  public candidate = computed(() => this.pollVoting()?.poll_candidate);

  public position = computed(() => this.pollVoting()?.poll_position);

  public participant = computed(() => this.pollVoting()?.poll_participant);
}