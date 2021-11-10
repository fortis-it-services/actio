import { createReducer, on } from '@ngrx/store';
import { GithubWorkflowRunModel } from '../../git-hub.service';
import { pollWorkflowsRunsSuccess } from './workflow.actions';
import { loginFailure } from '../user/user.actions';

export const initialState: GithubWorkflowRunModel[] = []

export const workflowRunsReducer = createReducer(
  initialState,
  on(pollWorkflowsRunsSuccess, (state, { workflowRuns }): GithubWorkflowRunModel[] => workflowRuns),
  on(loginFailure, (): GithubWorkflowRunModel[] => initialState),
);
