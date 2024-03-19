import { createAction, props } from '@ngrx/store';
import { RateLimit, Team, User } from '../../git-hub.service';

export const loginSuccess = createAction(
  '[GitHub API] Login Success',
  props<{ userProfile: User }>(),
);

export const loginFailure = createAction(
  '[GitHub API] Login Failure',
);

export const loadRateLimitSuccess = createAction(
  '[GitHub API] Load Rate Limit Success',
  props<{ rateLimits: RateLimit }>(),
);

export const loadTeamsSuccess = createAction(
  '[GitHub API] Load Teams Success',
  props<{ teams: Team[] }>(),
);
