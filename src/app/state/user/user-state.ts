import { GitHubRateLimitModel, GitHubTeamModel, GitHubTeamRepositoriesModel, GitHubUser } from '../../git-hub.service';

export interface UserState {
  profile: GitHubUser | null,
  rateLimits: GitHubRateLimitModel,
  teams: GitHubTeamModel[],
  teamRepositories: GitHubTeamRepositoriesModel[],
}
