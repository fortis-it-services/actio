import { GitHubTeamModel } from '../../git-hub.service';

export interface ConfigurationState {
  polling: {
    pollingInterval: number,
    isPolling: boolean,
    lastPollStarted: Date | null,
    nextPollPercentage: number,
  }
  filter: {
    conclusion: string[],
    status: string[],
    teams: GitHubTeamModel[],
    workflowNames: string[],
  },
  maxWorkflowRunAge: number,
}
