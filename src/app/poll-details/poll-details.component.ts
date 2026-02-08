import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon"; 
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";
import { MatDialogModule } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatChipsModule } from "@angular/material/chips";
import { Component, computed, inject, OnDestroy, OnInit } from "@angular/core";
import { PollDetailsStore } from "@store/poll-details/poll-details.store";
import { PollDetailsNavbarComponent } from "./components/poll-details-navbar/poll-details-navbar.component";
import { ActivatedRoute, RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-poll-details',
  templateUrl: './poll-details.component.html',
  styleUrls: ['./poll-details.component.scss'],
  imports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatSelectModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    PollDetailsNavbarComponent,
    RouterOutlet,
  ],
})
export class PollDetailsComponent implements OnInit, OnDestroy {
  private readonly pollDetailsStore = inject(PollDetailsStore);
  private readonly route = inject(ActivatedRoute);

  public pollId = computed(() => this.route.snapshot.params['id']);

  public loading = computed(() => this.pollDetailsStore.loading());

  public ngOnInit(): void {
    this.pollDetailsStore.getPollDetails(this.pollId());
  }

  public ngOnDestroy(): void {
    this.pollDetailsStore.resetPollDetails();
  }
}