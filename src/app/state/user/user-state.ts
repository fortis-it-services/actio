import { GitHubRateLimitModel, GitHubTeamModel, GitHubUser } from '../../git-hub.service';

export interface UserState {
  profile: GitHubUser | null,
  rateLimits: GitHubRateLimitModel,
  teams: GitHubTeamModel[],
}
