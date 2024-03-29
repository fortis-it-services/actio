import { Team } from '../../git-hub.service';

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
    teams: Team[],
    workflowNames: string[],
  },
  maxWorkflowRunAge: number,
}
