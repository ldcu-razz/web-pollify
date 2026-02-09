import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { Component, computed, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { filter, map, startWith } from "rxjs";
import { PollDetailsStore } from "@store/poll-details/poll-details.store";
import { ROUTES as ROUTES_CONSTANTS } from "@constants/routes.constants";
import { DatePipe } from "@angular/common";

export type PollDetailsNavItem = "overview" | "candidates" | "positions" | "participants" | "votings";

@Component({
  selector: 'app-poll-details-navbar',
  templateUrl: './poll-details-navbar.component.html',
  styleUrls: ['./poll-details-navbar.component.scss'],
  imports: [MatButtonModule, MatIconModule, DatePipe],
})
export class PollDetailsNavbarComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly pollDetailsStore = inject(PollDetailsStore);

  public poll = computed(() => this.pollDetailsStore.poll());

  public pollStartDate = computed(() => this.poll()?.date_time_start);

  public pollEndDate = computed(() => this.poll()?.date_time_end);

  public isPollPublished = computed(() => this.pollDetailsStore.isPollPublished());

  public isPollClosed = computed(() => this.pollDetailsStore.isPollClosed());

  public hasPollDuration = computed(() => this.pollStartDate() !== null && this.pollEndDate() !== null);

  public isPollDurationValidTodaysTimeAndDate = computed(() => this.pollDetailsStore.isPollDurationValidTodaysTimeAndDate());

  public isPollExceedToEndDateToday = computed(() => this.pollDetailsStore.isPollExceedToEndDateToday());

  public activeNavItem = signal<PollDetailsNavItem>("overview");

  public setActiveNavItem(item: PollDetailsNavItem): void {
    this.activeNavItem.set(item);
  }

  private overviewRoute = computed(() => [
    ROUTES_CONSTANTS.MAIN.BASE,
    ROUTES_CONSTANTS.MAIN.POLLS,
    this.poll()?.id ?? '',
  ]);

  private candidatesRoute = computed(() => [
    ROUTES_CONSTANTS.MAIN.BASE,
    ROUTES_CONSTANTS.MAIN.POLLS,
    this.poll()?.id ?? '',
    ROUTES_CONSTANTS.MAIN.POLL_DETAILS_CANDIDATES,
  ]);

  private positionsRoute = computed(() => [
    ROUTES_CONSTANTS.MAIN.BASE,
    ROUTES_CONSTANTS.MAIN.POLLS,
    this.poll()?.id ?? '',
    ROUTES_CONSTANTS.MAIN.POLL_DETAILS_POSITIONS,
  ]);

  private participantsRoute = computed(() => [
    ROUTES_CONSTANTS.MAIN.BASE,
    ROUTES_CONSTANTS.MAIN.POLLS,
    this.poll()?.id ?? '',
    ROUTES_CONSTANTS.MAIN.POLL_DETAILS_PARTICIPANTS,
  ]);

  private votingsRoute = computed(() => [
    ROUTES_CONSTANTS.MAIN.BASE,
    ROUTES_CONSTANTS.MAIN.POLLS,
    this.poll()?.id ?? '',
    ROUTES_CONSTANTS.MAIN.POLL_DETAILS_VOTINGS,
  ]);

  private currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url)
    ),
    { initialValue: this.router.url }
  );

  public isOverviewActive = computed(() => {
    const url = this.currentUrl() ?? '';
    return url.includes(ROUTES_CONSTANTS.MAIN.POLLS) && !url.includes(ROUTES_CONSTANTS.MAIN.POLL_DETAILS_CANDIDATES) && !url.includes(ROUTES_CONSTANTS.MAIN.POLL_DETAILS_POSITIONS) && !url.includes(ROUTES_CONSTANTS.MAIN.POLL_DETAILS_PARTICIPANTS) && !url.includes(ROUTES_CONSTANTS.MAIN.POLL_DETAILS_VOTINGS);
  });

  public isCandidatesActive = computed(() => {
    const url = this.currentUrl() ?? '';
    return url.includes(ROUTES_CONSTANTS.MAIN.POLL_DETAILS_CANDIDATES);
  });

  public isPositionsActive = computed(() => {
    const url = this.currentUrl() ?? '';
    return url.includes(ROUTES_CONSTANTS.MAIN.POLL_DETAILS_POSITIONS);
  });

  public isParticipantsActive = computed(() => {
    const url = this.currentUrl() ?? '';
    return url.includes(ROUTES_CONSTANTS.MAIN.POLL_DETAILS_PARTICIPANTS);
  });

  public isVotingsActive = computed(() => {
    const url = this.currentUrl() ?? '';
    return url.includes(ROUTES_CONSTANTS.MAIN.POLL_DETAILS_VOTINGS);
  });

  public navigateToPolls(): void {
    this.router.navigate([
      ROUTES_CONSTANTS.MAIN.BASE,
      ROUTES_CONSTANTS.MAIN.POLLS,
    ]);
  }

  public navigateToOverview(): void {
    this.router.navigate(this.overviewRoute());
    this.setActiveNavItem('overview');
  }

  public navigateToCandidates(): void {
    this.router.navigate(this.candidatesRoute());
    this.setActiveNavItem('candidates');
  }

  public navigateToPositions(): void {
    this.router.navigate(this.positionsRoute());
    this.setActiveNavItem('positions');
  }

  public navigateToParticipants(): void {
    this.router.navigate(this.participantsRoute());
    this.setActiveNavItem('participants');
  }

  public navigateToVotings(): void {
    this.router.navigate(this.votingsRoute());
    this.setActiveNavItem('votings');
  }
}