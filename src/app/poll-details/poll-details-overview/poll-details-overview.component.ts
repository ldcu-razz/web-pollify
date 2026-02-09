import { Component, computed, effect, inject, signal, untracked } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import {provideNativeDateAdapter} from '@angular/material/core';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { PollDetailsStore } from "@store/poll-details/poll-details.store";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { DatePipe } from "@angular/common";
import { TextTransformPipe } from "@pipes/text-transform.pipe";
import { MatDialog } from "@angular/material/dialog";
import { PollFormComponent } from "src/app/polls/components/poll-form/poll-form.component";
import { PollPublishConfirmationComponent } from "./components/poll-publish-confirmation/poll-publish-confirmation.component";
import { PollCloseConfirmationComponent } from "./components/poll-close-confirmation/poll-close-confirmation.component";

@Component({
  selector: 'app-poll-details-overview',
  templateUrl: './poll-details-overview.component.html',
  styleUrls: ['./poll-details-overview.component.scss'],
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    DatePipe,
    TextTransformPipe,
  ],
  providers: [
    provideNativeDateAdapter(),
  ],
})
export class PollDetailsOverviewComponent {
  private readonly pollDetailsStore = inject(PollDetailsStore); 
  private readonly dialog = inject(MatDialog);

  public poolLoading = computed(() => this.pollDetailsStore.loading());

  public poll = computed(() => this.pollDetailsStore.poll());

  public isPollPublished = computed(() => this.pollDetailsStore.isPollPublished());
  public isPollClosed = computed(() => this.pollDetailsStore.isPollClosed());
  public isPollDraft = computed(() => this.pollDetailsStore.isPollDraft());

  public startDate = signal<Date | null>(null);
  public startTime = signal<string>('09:00');
  public endDate = signal<Date | null>(null);
  public endTime = signal<string>('17:00');
  public minDate = computed(() => new Date());

  public startDateTime = computed(() => {
    if (!this.startDate()) return null;
    const [h = 0, m = 0] = this.startTime().split(':').map(Number);
    const d = new Date(this.startDate() ?? '');
    d.setHours(h, m, 0, 0);
    return d.toISOString();
  });

  public endDateTime = computed(() => {
    if (!this.endDate()) return null;
    const [h = 0, m = 0] = this.endTime().split(':').map(Number);
    const d = new Date(this.endDate() ?? '');
    d.setHours(h, m, 0, 0);
    return d.toISOString();
  });

  // eslint-disable-next-line no-unused-private-class-members
  #checkStartAndEndDate = effect(() => {
    const pollStartDate = this.poll()?.date_time_start;
    const pollEndDate = this.poll()?.date_time_end;

    untracked(() => {
      if (pollStartDate) {
        const d = new Date(pollStartDate);
        this.startDate.set(d);
        this.startTime.set(this.formatTimeLocal(d));
      }
      if (pollEndDate) {
        const d = new Date(pollEndDate);
        this.endDate.set(d);
        this.endTime.set(this.formatTimeLocal(d));
      }
    })
  });

  private formatTimeLocal(d: Date): string {
    const hours = d.getHours();
    const minutes = d.getMinutes();
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  public openEditPollDialog(): void {
    this.dialog.open(PollFormComponent, {
      width: '100%',
      maxWidth: '600px',
      data: {
        mode: 'update',
        poll: this.poll() ?? null,
      },
    });
  }

  public setPollDuration(): void {
    if (this.startDateTime() && this.endDateTime()) {
      this.pollDetailsStore.setPollDuration(this.poll()?.id ?? '', this.startDateTime() ?? '', this.endDateTime() ?? '');
    }
  }

  public async resetPollDuration(): Promise<void> {
    if (!this.startDate() && !this.endDate()) {
      return;
    }

    await this.pollDetailsStore.resetPollDuration(this.poll()?.id ?? '');
    this.startDate.set(null);
    this.startTime.set('09:00');
    this.endDate.set(null);
    this.endTime.set('17:00');
  }

  public openPublishPollDialog(): void {
    this.dialog.open(PollPublishConfirmationComponent, {
      width: '100%',
      maxWidth: '600px',
      data: {
        pollId: this.poll()?.id ?? '',
      },
    });
  }

  public openClosePollDialog(): void {
    this.dialog.open(PollCloseConfirmationComponent, {
      width: '100%',
      maxWidth: '600px',
      data: {
        pollId: this.poll()?.id ?? '',
      },
    });
  }
}