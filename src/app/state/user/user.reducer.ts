import { createReducer, on } from '@ngrx/store';
import { loadRateLimitSuccess, loadTeamsSuccess, loginFailure, loginSuccess } from './user.actions';
import { UserState } from './user-state';
import { GitHubRateLimitModel } from '../../git-hub.service';

const initialState: UserState = {
  profile: null,
  rateLimits: {} as GitHubRateLimitModel,
  teams: [],
}

export const userReducer = createReducer(
  initialState,
  on(loginSuccess, (state, { userProfile }): UserState => ({
    ...state,
    profile: userProfile,
  })),
  on(loginFailure, (): UserState => (initialState)),
  on(loadRateLimitSuccess, (state, { rateLimits }): UserState => ({
    ...state,
    rateLimits,
  })),
  on(loadTeamsSuccess, (state, { teams }): UserState => ({
    ...state,
    teams,
  })),
);
