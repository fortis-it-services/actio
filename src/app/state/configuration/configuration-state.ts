import { GitHubTeamModel, GitHubTeamRepositoryModel } from '../../git-hub.service';

export interface ConfigurationState {
  pollingInterval: number,
  filter: {
    conclusion: string[],
    status: string[],
    teams: GitHubTeamModel[],
    teamRepository: GitHubTeamRepositoryModel[],
    workflowNames: string[],
  }
}
