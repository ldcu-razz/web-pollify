export const ROUTES = {
  AUTH: {
    LOGIN: '/login',
    PARTICIPANTS: '/login/participants',
  },
  MAIN: {
    BASE: 'main',
    DASHBOARD: 'dashboard',
    POLLS: 'polls',
    POLL_DETAILS: ':id',
    POLL_DETAILS_CANDIDATES: 'candidates',
    POLL_DETAILS_POSITIONS: 'positions',
    POLL_DETAILS_PARTICIPANTS: 'participants',
    POLL_DETAILS_VOTINGS: 'votings',
    GROUPS: 'groups',
    GROUP_DETAILS: ':id',
    USERS: 'users',
    USER_DETAILS: ':id',
    WORKSPACES: 'workspaces',
    WORKSPACE_DETAILS: ':id',
  },
  PARTICIPANT: {
    BASE: 'participant',
    VOTE: 'vote',
  },
};    