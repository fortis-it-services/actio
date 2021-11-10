import { createAction, props } from '@ngrx/store';
import { GitHubRateLimitModel, GitHubTeamModel, GitHubUser } from '../../git-hub.service';

export const loginSuccess = createAction(
  '[GitHub API] Login Success',
  props<{ userProfile: GitHubUser }>(),
);

export const loginFailure = createAction(
  '[GitHub API] Login Failure',
);

export const loadRateLimitSuccess = createAction(
  '[GitHub API] Load Rate Limit Success',
  props<{ rateLimits: GitHubRateLimitModel }>(),
);

export const loadTeamsSuccess = createAction(
  '[GitHub API] Load Teams Success',
  props<{ teams: GitHubTeamModel[] }>(),
);
