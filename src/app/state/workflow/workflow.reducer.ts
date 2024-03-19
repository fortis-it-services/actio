import { createReducer, on } from '@ngrx/store';
import { WorkflowRun } from '../../git-hub.service';
import { pollWorkflowsRunsSuccess } from './workflow.actions';
import { loginFailure } from '../user/user.actions';

export const initialState: WorkflowRun[] = []

export const workflowRunsReducer = createReducer(
  initialState,
  on(pollWorkflowsRunsSuccess, (state, { workflowRuns }): WorkflowRun[] => workflowRuns),
  on(loginFailure, (): WorkflowRun[] => initialState),
);
