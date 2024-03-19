import { createAction, props } from '@ngrx/store';
import { WorkflowRun } from '../../git-hub.service';

export const startPollingWorkflowRuns = createAction(
  '[GitHub API] Start Polling Workflow Runs',
);

export const pollingStarted = createAction(
  '[GitHub API] Polling Workflow Runs started',
);

export const updatePolling = createAction(
  '[GitHub API] Interval updated',
  props<{ interval: number }>(),
);

export const stopPollingWorkflowRuns = createAction(
  '[GitHub API] Stop Polling Workflow Runs',
);

export const pollWorkflowsRunsSuccess = createAction(
  '[GitHub API] Polling Workflow Runs Success',
  props<{ workflowRuns: WorkflowRun[] }>(),
);
