import { Component, computed, effect, inject, OnDestroy, OnInit, signal } from "@angular/core";
import { RouterModule } from "@angular/router";
import { VoteCardComponent } from "./components/vote-card/vote-card.component";
import { ParticipantVoteStore } from "@store/participant-vote/participant-vote.store";
import { AuthParticipantsStore } from "@store/auth/auth-participants.store";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { PollStatusSchema } from "@models/polls/polls.schema";
import { PollPositionWithCandidate } from "@models/participants/participant-vote.type";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { PollParticipantStatusSchema } from "@models/polls/poll-participants.schema";
import { VotedCardComponent } from "./components/voted-card/voted-card.component";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { ConfirmSubmitVoteDialogComponent } from "./components/confirm-submit-vote-dialog/confirm-submit-vote-dialog.component";

@Component({
  selector: 'app-participant-vote',
  templateUrl: './participant-vote.component.html',
  styleUrls: ['./participant-vote.component.scss'],
  imports: [RouterModule, VoteCardComponent, MatProgressSpinnerModule, MatIconModule, MatButtonModule, VotedCardComponent, MatDialogModule]
})
export class ParticipantVoteComponent implements OnInit, OnDestroy {
  private readonly participantVoteStore = inject(ParticipantVoteStore);
  private readonly authParticipantsStore = inject(AuthParticipantsStore);
  private readonly dialog = inject(MatDialog);

  private readonly tick = signal(0);
  private tickInterval?: ReturnType<typeof setInterval>;

  public loading = computed(() => this.participantVoteStore.loading());

  public submitVoteLoading = computed(() => this.participantVoteStore.submitVoteLoading());

  public pollId = computed(() => this.authParticipantsStore.session()?.poll_id ?? '');

  public poll = computed(() => this.participantVoteStore.participantVote()?.pool ?? null);

  public isPollDraft = computed(() => this.poll()?.status === PollStatusSchema.enum.draft);

  public isPollClosed = computed(() => this.poll()?.status === PollStatusSchema.enum.closed);

  public isPollPublished = computed(() => this.poll()?.status === PollStatusSchema.enum.published);

  public pollPositionsWithCandidates = signal<PollPositionWithCandidate[]>([]);

  public pollParticipantStatus = computed(() => this.authParticipantsStore.pollParticipantStatus());

  public participantDoneVoting = computed(() => this.pollParticipantStatus() === PollParticipantStatusSchema.enum.voted);

  public participantVotings = computed(() => this.participantVoteStore.participantVotings());

  public isPollOnTimeRange = computed(() => {
    const poll = this.poll();
    if (!poll || poll.status !== PollStatusSchema.enum.published || !poll.date_time_start || !poll.date_time_end) {
      return false;
    }
    return new Date() >= new Date(poll.date_time_start) && new Date() <= new Date(poll.date_time_end);
  });

  public participantId = computed(() => this.authParticipantsStore.session()?.poll_participant_id ?? '');

  public isPollExceedToEndDateToday = computed(() => {
    const poll = this.poll();
    if (!poll || poll.status !== PollStatusSchema.enum.published || !poll.date_time_end) {
      return false;
    }
    return new Date() > new Date(poll.date_time_end);
  });

  private readonly initializePollPositionsWithCandidatesEffect = effect(() => {
    this.pollPositionsWithCandidates.set(structuredClone(this.participantVoteStore.pollPositionsWithCandidates()));
  });

  public isPollNotYetStarted = computed(() => {
    const poll = this.poll();
    if (!poll || poll.status !== PollStatusSchema.enum.published || !poll.date_time_start) {
      return false;
    }
    return new Date() < new Date(poll.date_time_start);
  });

  public remainingTime = computed(() => {
    this.tick(); // Triggers recomputation every second
    const dateTimeEnd = this.poll()?.date_time_end;
    if (!dateTimeEnd) {
      return '0 hour 0 minute and 0 second';
    }
    const now = new Date();
    const endTime = new Date(dateTimeEnd);
    const remainingMs = endTime.getTime() - now.getTime();

    if (Number.isNaN(remainingMs) || remainingMs <= 0) {
      return '0 day 0 hour 0 minute and 0 second';
    }

    const days = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remainingMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

    const daysStr = days > 0 ? `${days} day${days !== 1 ? 's' : ''}, ` : '';
    const hoursStr = hours < 10 ? `0${hours}` : `${hours}`;
    const hourLabel = hours === 1 ? 'hour' : 'hours';
    const minuteLabel = minutes === 1 ? 'minute' : 'minutes';
    const secondLabel = seconds === 1 ? 'second' : 'seconds';

    return `${daysStr}${hoursStr} ${hourLabel}, ${minutes} ${minuteLabel} and ${seconds} ${secondLabel}`.trim();
  });

  public timeUntilStart = computed(() => {
    this.tick(); // Triggers recomputation every second
    const dateTimeStart = this.poll()?.date_time_start;
    if (!dateTimeStart) {
      return '0 day 0 hour 0 minute and 0 second';
    }
    const now = new Date();
    const startTime = new Date(dateTimeStart);
    const remainingMs = startTime.getTime() - now.getTime();

    if (Number.isNaN(remainingMs) || remainingMs <= 0) {
      return '0 day 0 hour 0 minute and 0 second';
    }

    const days = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remainingMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

    const daysStr = days > 0 ? `${days} day${days !== 1 ? 's' : ''}, ` : '';
    const hoursStr = hours < 10 ? `0${hours}` : `${hours}`;
    const hourLabel = hours === 1 ? 'hour' : 'hours';
    const minuteLabel = minutes === 1 ? 'minute' : 'minutes';
    const secondLabel = seconds === 1 ? 'second' : 'seconds';

    return `${daysStr}${hoursStr} ${hourLabel}, ${minutes} ${minuteLabel} and ${seconds} ${secondLabel}`.trim();
  });

  public async ngOnInit(): Promise<void> {
    await this.participantVoteStore.getParticipantVote(this.pollId());
    if (this.participantDoneVoting()) {
      await this.participantVoteStore.getParticipantVotings(this.participantId());
    }
    this.tickInterval = setInterval(() => this.tick.update((v) => v + 1), 1000);
  }

  public updatePollPositionAt(index: number, value: PollPositionWithCandidate): void {
    this.pollPositionsWithCandidates.update(arr => {
      const newArr = [...arr];
      newArr[index] = value;
      return newArr;
    });
  }

  public openSubmitVoteConfirmation(): void {
    const dialogRef = this.dialog.open(ConfirmSubmitVoteDialogComponent, {
      width: '640px',
      maxWidth: '95vw',
      data: {
        pollPositionsWithCandidates: this.pollPositionsWithCandidates(),
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        const filteredPollPositionWithCandidates = this.pollPositionsWithCandidates().filter(
          (pollPositionWithCandidate) => pollPositionWithCandidate.poll_selected.poll_candidate !== ''
        );
        this.participantVoteStore.createParticipantVote(filteredPollPositionWithCandidates);
      }
    });
  }

  public ngOnDestroy(): void {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
    }
    this.participantVoteStore.resetParticipantVote();
  }
}