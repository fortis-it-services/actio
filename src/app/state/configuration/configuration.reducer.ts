import { on } from '@ngrx/store';

import {
  addWorkflowNameFilter,
  changeConclusionFilter,
  changePollingInterval,
  changeStatusFilter,
  changeTeamsFilter, changeMaxWorkflowRunAge, removeWorkflowNameFilter,
} from './configuration.actions';
import { WorkflowRunStatus } from '../../workflow-run-status.enum';
import { WorkflowRunConclusion } from '../../workflow-run-conclusion.enum';
import { ConfigurationState } from './configuration-state';
import { createRehydrateReducer } from '../app-state';
import { configurationFeatureKey } from './configuration.selectors';

const initialState: ConfigurationState = {
  pollingInterval: 30,
  filter: {
    teams: [],
    status: Object.values(WorkflowRunStatus),
    conclusion: Object.values(WorkflowRunConclusion),
    workflowNames: [],
  },
  maxWorkflowRunAge: 14,
};

export const configurationReducer = createRehydrateReducer(
  configurationFeatureKey,
  initialState,
  on(changeTeamsFilter, (state, { filter }): ConfigurationState => ({
    ...state,
    filter: {
      teams: filter,
      status: state.filter.status,
      conclusion: state.filter.conclusion,
      workflowNames: state.filter.workflowNames,
    },
  })),
  on(changeStatusFilter, (state, { filter }): ConfigurationState => ({
    ...state,
    filter: {
      teams: state.filter.teams,
      status: filter,
      conclusion: state.filter.conclusion,
      workflowNames: state.filter.workflowNames,
    },
  })),
  on(changeConclusionFilter, (state, { filter }): ConfigurationState => ({
    ...state,
    filter: {
      teams: state.filter.teams,
      status: state.filter.status,
      conclusion: filter,
      workflowNames: state.filter.workflowNames,
    },
  })),
  on(changePollingInterval, (state, { interval }): ConfigurationState => ({
    ...state,
    pollingInterval: interval ?? initialState.pollingInterval,
  })),
  on(addWorkflowNameFilter, (state, { filter }): ConfigurationState => ({
    ...state,
    filter: {
      teams: state.filter.teams,
      status: state.filter.status,
      conclusion: state.filter.conclusion,
      workflowNames: [...new Set([...state.filter.workflowNames, filter])],
    },
  })),
  on(removeWorkflowNameFilter, (state, { filter }): ConfigurationState => ({
    ...state,
    filter: {
      teams: state.filter.teams,
      status: state.filter.status,
      conclusion: state.filter.conclusion,
      workflowNames: state.filter.workflowNames.filter(it => it !== filter),
    },
  })),
  on(changeMaxWorkflowRunAge, (state, { age }): ConfigurationState => ({
    ...state,
    maxWorkflowRunAge: age,
  })),
);
