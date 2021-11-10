import { createAction, props } from '@ngrx/store';
import { GithubWorkflowRunModel } from '../../git-hub.service';

export const startPollingWorkflowRuns = createAction(
  '[GitHub API] Start Polling Workflow Runs',
);

export const stopPollingWorkflowRuns = createAction(
  '[GitHub API] Stop Polling Workflow Runs',
);

export const pollWorkflowsRunsSuccess = createAction(
  '[GitHub API] Polling Workflow Runs Success',
  props<{ workflowRuns: GithubWorkflowRunModel[] }>(),
);
