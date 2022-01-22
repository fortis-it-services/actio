import { on } from '@ngrx/store';

import {
  addWorkflowNameFilter,
  changeConclusionFilter,
  changePollingInterval,
  changeStatusFilter, changeTeamRepositoryFilter,
  changeTeamsFilter, removeWorkflowNameFilter,
} from './configuration.actions';
import { WorkflowRunStatus } from '../../workflow-run/workflow-run-status.enum';
import { WorkflowRunConclusion } from '../../workflow-run/workflow-run-conclusion.enum';
import { ConfigurationState } from './configuration-state';
import { createRehydrateReducer } from '../app-state';
import { configurationFeatureKey } from './configuration.selectors';

const initialState: ConfigurationState = {
  pollingInterval: 30,
  filter: {
    teams: [],
    teamRepository: [],
    status: Object.values(WorkflowRunStatus),
    conclusion: Object.values(WorkflowRunConclusion),
    workflowNames: [],
  },
};

export const configurationReducer = createRehydrateReducer(
  configurationFeatureKey,
  initialState,
  on(changeTeamsFilter, (state, { filter }): ConfigurationState => ({
    ...state,
    filter: {
      teams: filter,
      teamRepository: state.filter.teamRepository,
      status: state.filter.status,
      conclusion: state.filter.conclusion,
      workflowNames: state.filter.workflowNames,
    },
  })),
  on(changeTeamRepositoryFilter, (state, { filter }): ConfigurationState => ({
    ...state,
    filter: {
      teams: state.filter.teams,
      teamRepository: filter,
      status: state.filter.status,
      conclusion: state.filter.conclusion,
      workflowNames: state.filter.workflowNames,
    },
  })),
  on(changeStatusFilter, (state, { filter }): ConfigurationState => ({
    ...state,
    filter: {
      teams: state.filter.teams,
      teamRepository: state.filter.teamRepository,
      status: filter,
      conclusion: state.filter.conclusion,
      workflowNames: state.filter.workflowNames,
    },
  })),
  on(changeConclusionFilter, (state, { filter }): ConfigurationState => ({
    ...state,
    filter: {
      teams: state.filter.teams,
      teamRepository: state.filter.teamRepository,
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
      teamRepository: state.filter.teamRepository,
      status: state.filter.status,
      conclusion: state.filter.conclusion,
      workflowNames: [...new Set([...state.filter.workflowNames, filter])],
    },
  })),
  on(removeWorkflowNameFilter, (state, { filter }): ConfigurationState => ({
    ...state,
    filter: {
      teams: state.filter.teams,
      teamRepository: state.filter.teamRepository,
      status: state.filter.status,
      conclusion: state.filter.conclusion,
      workflowNames: state.filter.workflowNames.filter(it => it !== filter),
    },
  })),
);
